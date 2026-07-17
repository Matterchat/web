import { MessagingCore } from "@/classes/messaging_core";
import { useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageModel, UserModel } from "@matterchat/contracts";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/classes/api/api";
import { LoadingSplash } from "../splash/LoadingSplash";
import { ErrorSplash } from "../splash/ErrorSplash";
import { queryClient } from "@/providers/QueryProvider";

interface IChatMessageListProps {
  messagingCore: MessagingCore;
  workspaceId: string;
  channelId: string;
}

export function ChatMessageList(props: IChatMessageListProps) {
  const { data, isPending, error } = useQuery({
    queryKey: [
      "workspace",
      props.workspaceId,
      "channel",
      props.channelId,
      "messages",
    ],
    queryFn: () =>
      API.workspaces
        .id(props.workspaceId)
        .channels.id(props.channelId)
        .messages.list(50, 0),
  });

  useEffect(() => {
    const off = props.messagingCore.onMessage(async (msg) => {
      await queryClient.cancelQueries({
        queryKey: [
          "workspace",
          props.workspaceId,
          "channel",
          props.channelId,
          "messages",
        ],
      });

      const previousMessages = queryClient.getQueryData<MessageModel[]>([
        "workspace",
        props.workspaceId,
        "channel",
        props.channelId,
        "messages",
      ]);

      if (!previousMessages) return;

      queryClient.setQueryData<MessageModel[]>(
        [
          "workspace",
          props.workspaceId,
          "channel",
          props.channelId,
          "messages",
        ],
        [...previousMessages, msg],
      );
    });

    return () => {
      off();
    };
  }, [props.messagingCore]);

  if (isPending || !data) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash title="Failed to load messages" message={error.message} />
    );

  return (
    <div className="flex grow flex-col">
      {data.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
    </div>
  );
}
