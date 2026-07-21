import { API } from "@/classes/api/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export default async function Layout(
  props: PropsWithChildren<{
    params: Promise<{
      workspaceId: string;
      channelId: string;
    }>;
  }>,
) {
  const params = await props.params;

  // We need to create a new QueryClient for each request, otherwise the cache will be shared between requests
  // cause data leakage between users.
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["workspace", params.workspaceId, "channel", params.channelId],
    queryFn: () =>
      API.workspaces.id(params.workspaceId).channels.id(params.channelId).get(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["workspace", params.workspaceId, "members"],
    queryFn: () => API.workspaces.id(params.workspaceId).members.list(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
