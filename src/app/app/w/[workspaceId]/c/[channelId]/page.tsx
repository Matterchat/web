import { ChatWindow } from "@/components/chat/ChatWindow";
import { AppShell } from "@/components/shell/AppShell";
import { ChannelHeader } from "@/components/workspace/channel/ChannelHeader";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default async function Page(props: {
  params: Promise<{
    workspaceId: string;
    channelId: string;
  }>;
}) {
  const { workspaceId, channelId } = await props.params;

  return (
    <AppShell>
      <div className="flex flex-row w-full h-full">
        <WorkspaceSidebar
          workspaceId={workspaceId}
          activeChannelId={channelId}
        />
        <div className="h-full flex flex-col grow">
          <ChannelHeader workspaceId={workspaceId} channelId={channelId} />
          <ChatWindow />
        </div>
      </div>
    </AppShell>
  );
}
