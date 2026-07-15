"use client";

import { useGatewayState } from "@/hooks/states/useGatewayState";
import { useGateway } from "@/hooks/useGateway";

export function ChatWindow() {
  const isConnected = useGatewayState((state) => state.isConnected);

  return (
    <>
      <p>Gateway connected: {isConnected ? "Yes" : "No"}</p>
    </>
  );
}
