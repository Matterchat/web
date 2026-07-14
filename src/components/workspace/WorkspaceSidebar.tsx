"use client";

import { WorkspaceModelDto } from "@matterchat/contracts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoadingSplash } from "../splash/LoadingSplash";
import { ErrorSplash } from "../splash/ErrorSplash";
import { API } from "@/classes/api/api";
import { Button, buttonVariants } from "../ui/button";
import { LucideHash, LucidePlus } from "lucide-react";
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

interface IWorkspaceSidebarProps {
  workspaceId: string;
  activeChannelId?: string;
}

export function WorkspaceSidebar(props: IWorkspaceSidebarProps) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["workspace", props.workspaceId],
    queryFn: () => API.workspaces.id(props.workspaceId).get(),
  });

  if (isLoading) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash
        title="Failed to load workspace"
        message={error.message || "An unknown error occurred"}
      />
    );

  return (
    <div className="w-80 h-full border-r border-border p-6 flex flex-col gap-4">
      <p className="font-bold text-xl">{data!.name}</p>
      <div className="flex flex-col gap-2 w-full">
        <CreateChannelButton workspaceId={data!.id} />
        <WorkspaceSidebarChannelList
          workspaceId={data!.id}
          activeChannelId={props.activeChannelId}
        />
      </div>
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

interface ICreateChannelButtonProps {
  workspaceId: string;
}

function CreateChannelButton(props: ICreateChannelButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["workspaces.channels.create", props.workspaceId],
    mutationFn: (data: FormData) =>
      API.workspaces.id(props.workspaceId).channels.create({
        name: data.get("name") as string,
      }),
    onSuccess: (data) => {
      setIsOpen(false);
      router.push(`/app/w/${props.workspaceId}/c/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger
        render={
          <Button className="w-full" variant={"outline"}>
            <LucidePlus className="mr-2" /> Create channel{" "}
            <span className="ml-2"></span>
          </Button>
        }
      />
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
