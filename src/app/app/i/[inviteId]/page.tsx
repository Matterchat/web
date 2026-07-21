import { API } from "@/classes/api/api";
import { ErrorSplash } from "@/components/splash/ErrorSplash";
import { redirect } from "next/navigation";

interface IPageProps {
  params: Promise<{
    inviteId: string;
  }>;
}

export default async function Page(props: IPageProps) {
  let workspace;

  try {
    const { inviteId } = await props.params;
    workspace = await API.workspaces.invites.id(inviteId).accept();
  } catch (e) {
    return (
      <ErrorSplash
        title="Failed to accept invite"
        message={(e as Error).message}
      />
    );
  }

  redirect(`/app/w/${workspace.id}`);
}
