import { useEffect, useState } from "react";
import { useGatewayState } from "./states/useGatewayState";
import { GatewayEvent } from "@matterchat/contracts";

export function useGateway() {
  const gateway = useGatewayState((state) => state);

  return gateway;
}
