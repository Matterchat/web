import {
  MessageModel,
  MessageModelDto,
  UserModel,
} from "@matterchat/contracts";
import { UserAvatar } from "../user/UserAvatar";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";

interface IChatMessageProps {
  message: MessageModelDto;
}

export function ChatMessage(props: IChatMessageProps) {
  const users = useWorkspaceMembers();

  const sender = users.find((u) => u.id === props.message.userId);
  const isOnline =
    sender &&
    new Date().getTime() - new Date(sender.lastSeen).getTime() < 20000; // 10 seconds + 10 seconds buffer

  return (
    <div className="flex flex-row gap-4 px-8 py-2">
      <UserAvatar
        avatarUrl={sender?.avatarUrl || ""}
        fullName={sender?.fullName || ""}
        isOnline={!!isOnline}
        className="mt-1"
      />
      <div className="flex flex-col">
        <p className="font-bold">{sender?.fullName}</p>
        <p>{props.message.content}</p>
      </div>
    </div>
  );
}
