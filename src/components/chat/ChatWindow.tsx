"use client";

import { MessagingCore } from "@/classes/messaging_core";
import { useGatewayState } from "@/hooks/states/useGatewayState";
import { useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/classes/api/api";
import { LoadingSplash } from "../splash/LoadingSplash";
import { ErrorSplash } from "../splash/ErrorSplash";

interface IChatWindowProps {
  channelId: string;
  workspaceId: string;
}

export function ChatWindow(props: IChatWindowProps) {
  const gateway = useGatewayState((state) => state.gateway);
  const isConnected = useGatewayState((state) => state.isConnected);
  const messagingCore = useRef<MessagingCore>(MessagingCore.getInstance());

  useEffect(() => {
    messagingCore.current.setGateway(gateway);
  }, [gateway, messagingCore]);

  useEffect(() => {
    if (!isConnected) return;

    messagingCore.current.setChannelId(props.channelId);
  }, [props.channelId, isConnected, messagingCore]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatMessageList
        messagingCore={messagingCore.current}
        workspaceId={props.workspaceId}
        channelId={props.channelId}
      />
      <ChatInput messagingCore={messagingCore.current} />
    </div>
  );
}
