import type { Message } from "../../../types/message";
import MessageAttachments from "./MessageAttachments";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onUpdate: (messageId:number) => void;
  onDelete: (messageId:number) => void;
}

import { Pencil, Trash } from "lucide-react";

const MessageBubble = ({ message, isOwnMessage, onUpdate, onDelete }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} group`}
    >
      <div
        className={`relative max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-2 ${
          isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
        }`}
      >
        <p>{message.content}</p>

        {message.attachments?.length > 0 && (
          <MessageAttachments attachments={message.attachments} />
        )}

        <p
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString()}
        </p>

        {isOwnMessage && (
          <div className="absolute bottom-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
            <button
              className="p-1 rounded-full bg-white/20 hover:bg-white/30"
              onClick={() => onUpdate(message.id)}
            >
              <Pencil size={14} />
            </button>
            <button
              className="p-1 rounded-full bg-white/20 hover:bg-red-500/80"
              onClick={() => onDelete(message.id)}
            >
              <Trash size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export default MessageBubble;