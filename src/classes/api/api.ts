import {
  ApiVersion,
  CreateWorkspaceBodyDto,
  CreateWorkspaceChannelDto,
  GatewayTicketResponseDto,
  MessageModelDto,
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
      uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return await ApiClient.post<UserModelDto, FormData>(
          ApiVersion.v1,
          `/users/${userId}/avatar`,
          formData,
        );
      },
    }),
    presence: {
      confirm: async () =>
        await ApiClient.post<{}, {}>(ApiVersion.v1, "/users/presence", {}),
    },
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
      members: {
        list: async () =>
          await ApiClient.get<UserModelDto[]>(
            ApiVersion.v1,
            `/workspaces/${workspaceId}/members`,
          ),
      },
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

          messages: {
            list: async (limit: number, offset: number) =>
              await ApiClient.get<MessageModelDto[]>(
                ApiVersion.v1,
                `/workspaces/${workspaceId}/channels/${channelId}/messages?limit=${limit}&offset=${offset}`,
              ),
          },
        }),
      },
      invites: {
        create: async () =>
          await ApiClient.post<{ id: string }, {}>(
            ApiVersion.v1,
            `/workspaces/${workspaceId}/invites`,
            {},
          ),
      },
    }),
    invites: {
      id: (inviteId: string) => ({
        accept: async () =>
          await ApiClient.post<WorkspaceModelDto, {}>(
            ApiVersion.v1,
            `/workspaces/invites/${inviteId}/accept`,
            {},
          ),
      }),
    },
  };

  static readonly gateway = {
    requestTicket: async () =>
      await ApiClient.get<GatewayTicketResponseDto>(
        ApiVersion.v1,
        "/gateway/ticket",
      ),
  };
}
