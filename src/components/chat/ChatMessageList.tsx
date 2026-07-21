import { MessagingCore } from "@/classes/messaging_core";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageModel, UserModel } from "@matterchat/contracts";
import {
  useInfiniteQuery,
  useQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { API } from "@/classes/api/api";
import { LoadingSplash } from "../splash/LoadingSplash";
import { ErrorSplash } from "../splash/ErrorSplash";
import { queryClient } from "@/providers/QueryProvider";
import { useVirtualizer } from "@tanstack/react-virtual";

interface IChatMessageListProps {
  messagingCore: MessagingCore;
  workspaceId: string;
  channelId: string;
  users: UserModel[];
}

export function ChatMessageList(props: IChatMessageListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "workspace",
      props.workspaceId,
      "channel",
      props.channelId,
      "messages",
    ],
    queryFn: (ctx) =>
      API.workspaces
        .id(props.workspaceId)
        .channels.id(props.channelId)
        .messages.list(50, (ctx.pageParam as number) ?? 0),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 50) return undefined;
      return pages.length * 50;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const off = props.messagingCore.onMessage(async (msg) => {
      const queryKey = [
        "workspace",
        props.workspaceId,
        "channel",
        props.channelId,
        "messages",
      ];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<MessageModel[]>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx) => {
              if (idx === 0) return [...page, msg];

              return page;
            }),
          };
        },
      );
    });

    return () => {
      off();
    };
  }, [props.messagingCore, props.workspaceId, props.channelId]);

  // Sort pages so that the oldest page is at the start and the newest page is at the end
  const allRows = data ? [...data.pages].reverse().flatMap((d) => d) : [];

  // Deduplicate messages by ID to handle offset shifts from newly sent real-time messages
  const seenIds = new Set<string>();
  const uniqueRows = allRows.filter((msg) => {
    if (!msg || !msg.id) return true;
    if (seenIds.has(msg.id)) return false;

    seenIds.add(msg.id);

    return true;
  });

  const count = uniqueRows.length + 1;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    getItemKey: (index) => {
      if (index === 0) return "loader-header";
      return uniqueRows?.[index - 1]?.id ?? index;
    },
    anchorTo: "end",
    followOnAppend: true,
    scrollEndThreshold: 80,
    overscan: 6,
  });

  const lastChannelId = useRef<string | null>(null);
  const initialScrollCompletedRef = useRef<boolean>(false);
  const firstMessageIdRef = useRef<string | undefined>(undefined);
  const lastScrollHeightRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (status === "success" && props.channelId !== lastChannelId.current) {
      lastChannelId.current = props.channelId;
      initialScrollCompletedRef.current = false;
      firstMessageIdRef.current = undefined;
      lastScrollHeightRef.current = 0;

      const handle = requestAnimationFrame(() => {
        virtualizer.scrollToIndex(count - 1);
        initialScrollCompletedRef.current = true;
      });

      return () => cancelAnimationFrame(handle);
    }
  }, [status, props.channelId, virtualizer, count]);

  useLayoutEffect(() => {
    if (!parentRef.current) return;
    // Only adjust scroll position if the initial scroll to bottom has already completed
    if (!initialScrollCompletedRef.current) return;

    const container = parentRef.current;
    const firstMsg = uniqueRows[0];
    const firstMsgId = firstMsg?.id;

    if (
      firstMsgId &&
      firstMessageIdRef.current &&
      firstMsgId !== firstMessageIdRef.current
    ) {
      // Items were prepended, adjust scroll position to prevent jumping
      const delta = container.scrollHeight - lastScrollHeightRef.current;
      if (delta > 0) container.scrollTop = container.scrollTop + delta;
    }

    firstMessageIdRef.current = firstMsgId;
    lastScrollHeightRef.current = container.scrollHeight;
  }, [uniqueRows]);

  useEffect(() => {
    if (!initialScrollCompletedRef.current) return;

    const firstItem = virtualizer.getVirtualItems()[0];
    if (!firstItem) return;

    // Trigger loading older messages when user scrolls near the top (loader index 0 or first message index 1)
    if (firstItem.index <= 1 && hasNextPage && !isFetchingNextPage)
      fetchNextPage();
  }, [
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ]);

  if (status == "pending" || !data) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash title="Failed to load messages" message={error.message} />
    );

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto w-full relative"
      ref={parentRef}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const isLoaderRow = virtualItem.index === 0;
          const msg = uniqueRows[virtualItem.index - 1];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="p-4 text-center text-zinc-500 text-sm">
                  {hasNextPage ? "Loading..." : "No more messages"}
                </div>
              ) : (
                <ChatMessage message={msg} users={props.users} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
