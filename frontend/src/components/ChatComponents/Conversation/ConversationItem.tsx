import type { Conversation } from '../../../types/conversation';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: any) => void;
}

const ConversationItem = ({ conversation, isSelected, onSelect }: ConversationItemProps) => {
  const handleClick = () => {
    onSelect({
      id: conversation.user.id,
      username: conversation.user.username,
      is_online: conversation.user.is_online
    });
  };

  return (
    <div 
      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {conversation.user.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {conversation.user.username}
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-400 truncate">
            {conversation.last_message?.content || 'No messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;