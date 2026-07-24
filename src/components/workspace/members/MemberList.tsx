"use client";

import { API } from "@/classes/api/api";
import { ErrorSplash } from "@/components/splash/ErrorSplash";
import { LoadingSplash } from "@/components/splash/LoadingSplash";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface IMemberListProps {
  workspaceId: string;
}

export function MemberList(props: IMemberListProps) {
  const members = useWorkspaceMembers();

  return (
    <div className="flex flex-col gap-2 p-4 h-full w-64 border-l border-border">
      {members.map((member) => {
        const isOnline =
          new Date().getTime() - new Date(member.lastSeen).getTime() < 12000; // 10 seconds + 2 seconds buffer

        return (
          <div
            key={member.id}
            className="flex flex-row gap-2 items-center relative"
          >
            <UserAvatar
              avatarUrl={member.avatarUrl}
              fullName={member.fullName}
              isOnline={isOnline}
            />
            <p>{member.fullName}</p>
          </div>
        );
      })}
    </div>
  );
}
