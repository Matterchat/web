"use client";

import { useConfig } from "@/hooks/useConfig";

export default function Page() {
  const config = useConfig();

  return <p>{JSON.stringify(config)}</p>;
}
