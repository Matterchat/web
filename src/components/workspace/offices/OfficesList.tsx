"use client";

import { API } from "@/classes/api/api";
import { ErrorSplash } from "@/components/splash/ErrorSplash";
import { LoadingSplash } from "@/components/splash/LoadingSplash";
import { useQuery } from "@tanstack/react-query";

interface IOfficesLayoutProps {
  workspaceId: string;
}

interface IActiveCall {
  token: string;
  url: string;
  name: string;
}

export function OfficesLayout(props: IOfficesLayoutProps) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["workspace", props.workspaceId, "offices"],
    queryFn: () => API.workspaces.id(props.workspaceId).offices.list(),
  });

  if (isLoading || !data) return <LoadingSplash />;
  if (error)
    return (
      <ErrorSplash title="Failed to fetch offices" message={error.message} />
    );

  return (
    <div className="grid grid-cols-4 grow gap-4 p-8 items-start align-baseline">
      {data.map((office) => {
        return (
          <div
            key={office.id}
            className={`w-full border border-border h-24 rounded-xl flex items-center justify-between p-5 cursor-pointer transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-foreground">{office.name}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
