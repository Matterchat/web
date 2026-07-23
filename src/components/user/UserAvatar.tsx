import { cn } from "@/lib/utils";
import Image from "next/image";

interface IUserAvatarProps {
  avatarUrl: string;
  fullName: string;
  isOnline: boolean;
  className?: string;
}

export function UserAvatar(props: IUserAvatarProps) {
  return (
    <div className={cn("relative size-8", props.className)}>
      <Image
        src={props.avatarUrl}
        alt={props.fullName}
        width={32}
        height={32}
        unoptimized
        className="rounded-sm"
      />
      <div
        className={cn(
          `size-3 absolute -right-0.5 -bottom-0.5 rounded-full border-2 border-background`,
          props.isOnline ? "bg-green-500" : "bg-gray-500",
        )}
      ></div>
    </div>
  );
}
