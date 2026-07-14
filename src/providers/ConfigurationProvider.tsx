"use client";

import { ErrorSplash } from "@/components/splash/ErrorSplash";
import { LoadingSplash } from "@/components/splash/LoadingSplash";
import { useConfigState } from "@/hooks/states/useConfigState";
import axios from "axios";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";

export interface IConfigurationProviderProps {}

export function ConfigurationProvider(
  props: PropsWithChildren<IConfigurationProviderProps>,
) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setConfiguration = useConfigState((state) => state.setConfiguration);

  const fetchConfiguration = async () => {
    if (loading) return;
    setLoading(true);

    const response = await axios
      .get("/configuration.json")
      .catch((e) => ({ error: e.response }));

    setLoading(false);
    setFetched(true);

    if ("error" in response)
      setError(response.error?.data?.message || "Unknown error");
    else setConfiguration(response.data);
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  if (loading || !fetched) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash title="Failed to fetch configuration" message={error} />
    );

  return props.children;
}
