interface ChatHeaderProps {
  conversation: {
    username: string;
    is_online: boolean;
  };
}

const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {conversation.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {conversation.username}
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            {conversation.is_online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;