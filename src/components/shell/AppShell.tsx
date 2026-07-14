import { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

export interface IAppShellProps {}

export function AppShell(props: PropsWithChildren<IAppShellProps>) {
  return (
    <div className="w-screen h-screen overflow-hidden p-2 pl-0 bg-accent flex flex-row">
      <Sidebar />
      <div className="w-full h-full border-border border bg-background rounded-md">
        {props.children}
      </div>
    </div>
  );
}
