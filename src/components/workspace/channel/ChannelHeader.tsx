"use client";

import { API } from "@/classes/api/api";
import { useQuery } from "@tanstack/react-query";
import { LucideHash } from "lucide-react";

interface IChannelHeaderProps {
  workspaceId: string;
  channelId: string;
}

export function ChannelHeader(props: IChannelHeaderProps) {
  const { data } = useQuery({
    queryKey: ["workspace", props.workspaceId, "channel", props.channelId],
    queryFn: () =>
      API.workspaces.id(props.workspaceId).channels.id(props.channelId).get(),
  });

  return (
    <div className="flex flex-row items-center gap-2 border-border border-b p-4">
      <h1 className="text-lg font-semibold">
        <LucideHash className="size-5 inline mr-2" /> {data?.name}
      </h1>
    </div>
  );
}
