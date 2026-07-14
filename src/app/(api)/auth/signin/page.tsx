"use client";

import { signIn } from "next-auth/react";
import { LoadingSplash } from "@/components/splash/LoadingSplash";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const callbackUrl = new URLSearchParams(window.location.search).get(
      "callbackUrl",
    );

    if (callbackUrl) signIn("keycloak", { callbackUrl });
    else signIn("keycloak", { callbackUrl: "/" });
  }, []);

  return <LoadingSplash />;
}
