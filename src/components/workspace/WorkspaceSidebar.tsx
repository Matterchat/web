"use client";

import { WorkspaceModelDto } from "@matterchat/contracts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoadingSplash } from "../splash/LoadingSplash";
import { ErrorSplash } from "../splash/ErrorSplash";
import { API } from "@/classes/api/api";
import { Button, buttonVariants } from "../ui/button";
import {
  LucideHash,
  LucideLink,
  LucideMoreHorizontal,
  LucidePlus,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface IWorkspaceSidebarProps {
  workspaceId: string;
  activeChannelId?: string;
}

export function WorkspaceSidebar(props: IWorkspaceSidebarProps) {
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

  const { isLoading, data, error } = useQuery({
    queryKey: ["workspace", props.workspaceId],
    queryFn: () => API.workspaces.id(props.workspaceId).get(),
  });

  if (isLoading) return <LoadingSplash />;
  if (error || !data)
    return (
      <ErrorSplash
        title="Failed to load workspace"
        message={error?.message || "An unknown error occurred"}
      />
    );

  return (
    <div className="w-80 h-full border-r border-border p-6 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-xl">{data.name}</p>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size="icon-sm" variant="ghost">
                <LucideMoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Members</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LucidePlus /> Invite
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <InviteCopyLinkWorkspaceItem workspace={data} />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Channels</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsCreateChannelOpen(true)}>
                <LucidePlus /> Create channel
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <WorkspaceSidebarChannelList
          workspaceId={data!.id}
          activeChannelId={props.activeChannelId}
        />
      </div>
      <CreateChannelDialog
        workspaceId={data.id}
        open={isCreateChannelOpen}
        onOpenChange={setIsCreateChannelOpen}
      />
    </div>
  );
}

interface IWorkspaceSidebarChannelListProps {
  workspaceId: string;
  activeChannelId?: string;
}

export function WorkspaceSidebarChannelList(
  props: IWorkspaceSidebarChannelListProps,
) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["workspace", props.workspaceId, "channels"],
    queryFn: () => API.workspaces.id(props.workspaceId).channels.list(),
  });

  if (isLoading) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash
        title="Failed to load channels"
        message={error.message || "An unknown error occurred"}
      />
    );

  return (
    <div className="flex flex-col gap-px w-full">
      {data!.map((channel) => {
        const isActive = channel.id === props.activeChannelId;

        return (
          <Link
            key={channel.id}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              size: "sm",
              className: "justify-start",
            })}
            onClick={(e) => {
              if (isActive) e.preventDefault();
            }}
            href={`/app/w/${props.workspaceId}/c/${channel.id}`}
          >
            <LucideHash className="inline size-4" /> {channel.name}
          </Link>
        );
      })}
    </div>
  );
}

interface ICreateChannelDialogProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateChannelDialog(props: ICreateChannelDialogProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["workspaces.channels.create", props.workspaceId],
    mutationFn: (data: FormData) =>
      API.workspaces.id(props.workspaceId).channels.create({
        name: data.get("name") as string,
      }),
    onSuccess: (data) => {
      props.onOpenChange(false);
      router.push(`/app/w/${props.workspaceId}/c/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <form
          className="grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(new FormData(e.currentTarget));
          }}
        >
          <DialogHeader>
            <DialogTitle>New channel</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Channel name" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface IInviteCopyLinkWorkspaceItemProps {
  workspace: WorkspaceModelDto;
}

export function InviteCopyLinkWorkspaceItem(
  props: IInviteCopyLinkWorkspaceItemProps,
) {
  const { mutate, isPending } = useMutation({
    mutationKey: ["workspaces.invites.create", props.workspace.id],
    mutationFn: () => API.workspaces.id(props.workspace.id).invites.create(),
    onSuccess: (data) => {
      navigator.clipboard.writeText(
        `${window.location.origin}/app/i/${data.id}`,
      );
      toast.success("Invite link copied to clipboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DropdownMenuItem onClick={() => mutate()} disabled={isPending}>
      <LucideLink /> Copy invite link
    </DropdownMenuItem>
  );
}
