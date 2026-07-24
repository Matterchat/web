import { WorkspaceMembersContext } from "@/providers/WorkspaceMembersProvider";
import { useContext } from "react";

export function useWorkspaceMembers() {
  return useContext(WorkspaceMembersContext);
}
