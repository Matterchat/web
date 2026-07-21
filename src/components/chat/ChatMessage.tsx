import {
  MessageModel,
  MessageModelDto,
  UserModel,
} from "@matterchat/contracts";

interface IChatMessageProps {
  message: MessageModelDto;
  users: UserModel[];
}

export function ChatMessage(props: IChatMessageProps) {
  return (
    <div className="flex flex-col px-8 py-2">
      <p className="font-bold">
        {props.users.find((u) => u.id === props.message.userId)?.fullName}
      </p>
      <p>{props.message.content}</p>
    </div>
  );
}
