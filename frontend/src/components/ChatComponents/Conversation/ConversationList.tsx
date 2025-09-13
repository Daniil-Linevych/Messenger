import { Link } from 'react-router-dom';
import type { Conversation } from '../../../types/conversation';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedConversation: { id: number };
  onSelectConversation: (conversation: any) => void;
}

const ConversationList = ({ 
  conversations, 
  loading, 
  selectedConversation, 
  onSelectConversation 
}: ConversationListProps) => {
  return (
    <div className="w-1/4 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Conversations</h2>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {conversations.length > 0 ? conversations.map((conversation) => (
            <ConversationItem
              key={conversation.user.id}
              conversation={conversation}
              isSelected={selectedConversation.id === conversation.user.id}
              onSelect={onSelectConversation}
            />
          )) : <Link
              to="/users"
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded m-4 transition-colors"
            >
              Search Users
            </Link>
            }
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="p-4 flex justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

export default ConversationList;