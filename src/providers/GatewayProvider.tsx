"use client";

import { Gateway } from "@/classes/gateway";
import { useGatewayState } from "@/hooks/states/useGatewayState";
import { useConfig } from "@/hooks/useConfig";
import { GatewayEvent } from "@matterchat/contracts";
import { PropsWithChildren, useEffect } from "react";

export function GatewayProvider(props: PropsWithChildren<{}>) {
  const configuration = useConfig();
  const gw = useGatewayState();

  useEffect(() => {
    if (!configuration) return;

    const gateway = new Gateway(configuration.addresses.gateway);
    gw.setGateway(gateway);

    gateway.onceReady(() => {
      gateway.on(GatewayEvent.GatewayConnected, () => gw.setIsConnected(true));

      gw.setIsConnected(gateway.isConnected);
    });

    return () => {
      gateway.close();
      gw.setGateway(null);
    };
  }, [configuration]);

  return props.children;
}
