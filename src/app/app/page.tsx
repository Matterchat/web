import { API } from "@/classes/api/api";
import { AppShell } from "@/components/shell/AppShell";
import { CreateWorkspaceButton } from "./client";
import { Button, buttonVariants } from "@/components/ui/button";
import { LucideAtSign } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await API.users.id("@me").get();
  const workspaces = await API.workspaces.list();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">
            Hello{" "}
            <span className="font-bold text-primary">{user.fullName}</span>!
          </h1>
          <p className="text-muted-foreground">
            Where do you want to continue?
          </p>
        </div>
        <div className="flex items-center justify-center flex-row flex-wrap gap-2">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/app/w/${workspace.id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              <LucideAtSign className="mr-2" />
              {workspace.name}
            </Link>
          ))}
          <CreateWorkspaceButton />
        </div>
      </div>
    </AppShell>
  );
}
