import type { RefObject } from 'react';
import MessageBubble from './MessageBubble';
import type {Message} from "../../../types/message"

interface MessagesAreaProps {
  messages: Message[];
  loading: boolean;
  selectedConversationId: number;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onUpdateMessage: (messageId:number) => void;
  onDeleteMessage: (messageId:number) => void;
}

const MessagesArea = ({ 
  messages, 
  loading, 
  selectedConversationId, 
  messagesEndRef,
  onUpdateMessage,
  onDeleteMessage
}: MessagesAreaProps) => {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-neutral-800">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-neutral-800">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-neutral-400">No messages yet. Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-neutral-800">
      <div className="space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id !== selectedConversationId}
            onUpdate={onUpdateMessage}
            onDelete={onDeleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesArea;