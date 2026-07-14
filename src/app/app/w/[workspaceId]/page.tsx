import { AppShell } from "@/components/shell/AppShell";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default async function Page(props: {
  params: Promise<{
    workspaceId: string;
  }>;
}) {
  const { workspaceId } = await props.params;

  return (
    <AppShell>
      <div className="flex flex-row w-full h-full">
        <WorkspaceSidebar workspaceId={workspaceId} />
        <div className="h-full flex items-center justify-center grow">
          <p className="text-muted-foreground">
            Select a channel to start chatting
          </p>
        </div>
      </div>
    </AppShell>
  );
}
