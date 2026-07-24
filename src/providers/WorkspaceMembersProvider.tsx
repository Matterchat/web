"use client";

import { API } from "@/classes/api/api";
import { ErrorSplash } from "@/components/splash/ErrorSplash";
import { LoadingSplash } from "@/components/splash/LoadingSplash";
import { UserModelDto } from "@matterchat/contracts";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface IWorkspaceMembersProviderProps {
  workspaceId: string;
}

export const WorkspaceMembersContext = createContext<UserModelDto[]>([]);

export function WorkspaceMembersProvider(
  props: PropsWithChildren<IWorkspaceMembersProviderProps>,
) {
  const { data, isPending, error } = useQuery({
    queryKey: ["workspace", props.workspaceId, "members"],
    queryFn: () => API.workspaces.id(props.workspaceId).members.list(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  if (isPending || !data) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash title="Failed to fetch members" message={error.message} />
    );

  return (
    <WorkspaceMembersContext.Provider value={data}>
      {props.children}
    </WorkspaceMembersContext.Provider>
  );
}
