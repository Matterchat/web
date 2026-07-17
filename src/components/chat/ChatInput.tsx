import { MessagingCore } from "@/classes/messaging_core";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LucideSend } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface IChatInputProps {
  messagingCore: MessagingCore;
}

export function ChatInput(props: IChatInputProps) {
  const { mutate } = useMutation({
    mutationFn: (message: string) => props.messagingCore.sendMessage(message),
  });

  return (
    <form
      className="flex flex-row items-center justify-center gap-2 p-4"
      action={(data) => {
        mutate(data.get("message") as string);
      }}
    >
      <Input type="text" name="message" placeholder="Type a message..." />
      <Button type="submit" size="icon">
        <LucideSend />
      </Button>
    </form>
  );
}
