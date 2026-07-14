"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const client = new QueryClient();

export function QueryProvider(props: PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}
