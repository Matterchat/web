"use client";

import { LucideLogOut, LucideMessageCircle, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export function Sidebar() {
  return (
    <nav className="w-20 h-full flex flex-col justify-between px-2 py-2">
      <div className="flex flex-col items-center">
        <LucideMessageCircle />
      </div>
      <div className="flex"></div>
      <div className="flex flex-col gap-2 items-center">
        <SidebarButton
          icon={LucideLogOut}
          onClick={() => signOut({ callbackUrl: "/" })}
        />
      </div>
    </nav>
  );
}

interface ISidebarButtonProps {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  onClick: () => void;
}

function SidebarButton(props: ISidebarButtonProps) {
  return (
    <Button onClick={props.onClick}>
      <props.icon />
    </Button>
  );
}
