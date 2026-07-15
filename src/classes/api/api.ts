import {
  ApiVersion,
  CreateWorkspaceBodyDto,
  CreateWorkspaceChannelDto,
  GatewayTicketResponseDto,
  UserModelDto,
  WorkspaceChannelModelDto,
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
    id: (workspaceId: string) => ({
      get: async () =>
        await ApiClient.get<WorkspaceModelDto>(
          ApiVersion.v1,
          `/workspaces/${workspaceId}`,
        ),
      channels: {
        create: async (body: CreateWorkspaceChannelDto) =>
          await ApiClient.post<WorkspaceModelDto, CreateWorkspaceChannelDto>(
            ApiVersion.v1,
            `/workspaces/${workspaceId}/channels`,
            body,
          ),
        list: async () =>
          await ApiClient.get<WorkspaceChannelModelDto[]>(
            ApiVersion.v1,
            `/workspaces/${workspaceId}/channels`,
          ),
        id: (channelId: string) => ({
          get: async () =>
            await ApiClient.get<WorkspaceChannelModelDto>(
              ApiVersion.v1,
              `/workspaces/${workspaceId}/channels/${channelId}`,
            ),
        }),
      },
    }),
  };

  static readonly gateway = {
    requestTicket: async () =>
      await ApiClient.get<GatewayTicketResponseDto>(
        ApiVersion.v1,
        "/gateway/ticket",
      ),
  };
}
