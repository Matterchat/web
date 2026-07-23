import {
  MessageModel,
  MessageModelDto,
  UserModel,
} from "@matterchat/contracts";
import { UserAvatar } from "../user/UserAvatar";

interface IChatMessageProps {
  message: MessageModelDto;
  users: UserModel[];
}

export function ChatMessage(props: IChatMessageProps) {
  const sender = props.users.find((u) => u.id === props.message.userId);
  const isOnline =
    sender &&
    new Date().getTime() - new Date(sender.lastSeen).getTime() < 12000; // 10 seconds + 2 seconds buffer

  return (
    <div className="flex flex-row gap-4 px-8 py-2">
      <UserAvatar
        avatarUrl={sender?.avatarUrl || ""}
        fullName={sender?.fullName || ""}
        isOnline={!!isOnline}
        className="mt-1"
      />
      <div className="flex flex-col">
        <p className="font-bold">
          {props.users.find((u) => u.id === props.message.userId)?.fullName}
        </p>
        <p>{props.message.content}</p>
      </div>
    </div>
  );
}
