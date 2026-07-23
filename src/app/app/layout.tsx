import { PresenceProvider } from "@/providers/PresenceProvider";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren<{}>) {
  return <PresenceProvider>{props.children}</PresenceProvider>;
}
