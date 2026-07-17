import {
  MessageModel,
  MessageModelDto,
  UserModel,
} from "@matterchat/contracts";

interface IChatMessageProps {
  message: MessageModelDto;
}

export function ChatMessage(props: IChatMessageProps) {
  return (
    <div>
      <p>
        {props.message.userId}: {props.message.content}
      </p>
    </div>
  );
}
