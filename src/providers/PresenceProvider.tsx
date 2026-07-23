"use client";

import { API } from "@/classes/api/api";
import { BackgroundWorker, WorkerId } from "@/classes/Worker";
import { PropsWithChildren, useEffect } from "react";

export function PresenceProvider(props: PropsWithChildren<{}>) {
  useEffect(() => {
    const confirmPresence = () =>
      API.users.presence
        .confirm()
        .catch((e) => console.warn("Failed to confirm presence", e));

    confirmPresence();

    const worker = new BackgroundWorker(WorkerId.PresenceTicker);

    worker.onMessage((msg) => {
      if (msg !== "tick") return;

      confirmPresence();
    });

    worker.postMessage("start");

    return () => {
      worker.postMessage("stop");
      worker.terminate();
    };
  }, []);

  return props.children;
}
