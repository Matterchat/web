import {
  ApiVersion,
  CreateWorkspaceBodyDto,
  UserModelDto,
  WorkspaceModelDto,
} from "@matterchat/contracts";
import { ApiClient } from "./client";

export class API {
  static readonly users = {
    id: (userId: string) => ({
      get: async () =>
        await ApiClient.get<UserModelDto>(ApiVersion.v1, `/users/${userId}`),
    }),
  };

  static readonly workspaces = {
    create: async (body: CreateWorkspaceBodyDto) =>
      await ApiClient.post<WorkspaceModelDto, CreateWorkspaceBodyDto>(
        ApiVersion.v1,
        "/workspaces",
        body,
      ),
    list: async () =>
      await ApiClient.get<WorkspaceModelDto[]>(ApiVersion.v1, "/workspaces"),
  };
}
