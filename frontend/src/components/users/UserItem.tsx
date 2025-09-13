import { useNavigate } from 'react-router-dom';
import { conversationAPI } from '../../api/conversations';
import type { User } from '../../types/user';
import type { MessageSendData } from '../../types/message';

interface UserItemProps {
  user: User;
}

const UserItem = ({ user }:UserItemProps) => {
  const navigate = useNavigate();

  const handleGreetUser = async (userId:number) => {
    try {
        const greetMessage:MessageSendData = {
            content:'Hello',
            receiver_id: userId,
            attachments:[]
        }
        const result = await conversationAPI.createConversation(greetMessage);
        console.log(result)
        navigate('/chats');
    } catch (error) {
        console.error('Failed to create conversation:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {user.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user.username}
          </h3>
        </div>
      </div>
      <button
        onClick={(e) => {
            e.preventDefault();
            handleGreetUser(user.id);
        }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Greet
      </button>
    </div>
  );
};

export default UserItem;