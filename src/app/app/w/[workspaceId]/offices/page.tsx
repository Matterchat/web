import { AppShell } from "@/components/shell/AppShell";
import { OfficesLayout } from "@/components/workspace/offices/OfficesList";
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
        <OfficesLayout workspaceId={workspaceId} />
      </div>
    </AppShell>
  );
}
