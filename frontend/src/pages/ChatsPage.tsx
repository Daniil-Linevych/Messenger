import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/store_hooks';
import { loadConversations } from '../store/slices/conversation';
import { loadMessages, addMessage, updateMessage, deleteMessage } from '../store/slices/message';
import { uploadFiles } from '../store/slices/file'; 
import type { ConversationUser } from '../types/conversation';
import type { FileAttachment } from '../types/file';
import ConversationList from '../components/ChatComponents/Conversation/ConversationList';
import ChatHeader from '../components/ChatComponents/ChatHeader';
import MessagesArea from '../components/ChatComponents/Messages/MessagesArea';
import MessageInput from '../components/ChatComponents/Messages/MessageInput';
import NoConversationSelected from '../components/ChatComponents/Conversation/NoConversationSelected';
import { useChatSocket } from '../hooks/useChatSocket';

const ChatsPage = () => {
  const dispatch = useAppDispatch();
  const { conversations, loading: conversationLoading } = useAppSelector((state) => state.conversations);
  const { messages, loading: messagesLoading } = useAppSelector((state) => state.messages);
  const { loading: filesLoading} = useAppSelector((state) => state.files);
  
  const [selectedConversation, setSelectedConversation] = useState<ConversationUser>({id: 0, username: "", is_online: false});
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadConversations());
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation: ConversationUser) => {
    setSelectedConversation(conversation);
    dispatch(loadMessages(conversation.id));
 
    setUploadErrors([]);
  };

  const { sendMessage, updateExistingMessage, deleteExistingMessage} = useChatSocket(
    selectedConversation.id,
    (message) => dispatch(addMessage(message)),       
    (message) => dispatch(updateMessage(message)),    
    (id) => dispatch(deleteMessage(id))               
  );

  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return;

    if (filesLoading) return;

    if (editingMessageId) {
        updateExistingMessage(
            editingMessageId,
            messageText,
            attachments.map(a => a.id)
        );
        setEditingMessageId(null);
    } else {
        sendMessage(
            messageText,
            selectedConversation.id,
            attachments.map(a => a.id)
        );
    }

    setMessageText('');
    setAttachments([]);
    setUploadErrors([]);
  };

  const handleUpdateMessage = (messageId: number) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;
    
    setMessageText(msg.content ?? "");
    setAttachments(msg.attachments || []);
    setEditingMessageId(messageId);
  };

  const handleDeleteMessage = (messageId:number) => {
     deleteExistingMessage(messageId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setUploadErrors([]);
    
    try {
      const errors: string[] = [];
      const validFiles: File[] = [];
      
      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name} exceeds the 10MB size limit`);
        } else {
          validFiles.push(file);
        }
      });
      
      if (errors.length > 0) {
        setUploadErrors(errors);
      }
      
      if (validFiles.length === 0) return;
      
      const resultAction = await dispatch(uploadFiles({
        files: validFiles,
        conversationId: selectedConversation.id
      }));
      
      if (uploadFiles.fulfilled.match(resultAction)) {
        const uploadedAttachments = resultAction.payload;
        setAttachments([...attachments, ...uploadedAttachments]);
      } else if (uploadFiles.rejected.match(resultAction)) {
        setUploadErrors([resultAction.payload as string || 'Failed to upload files']);
      }
      
    } catch (error) {
      console.error('File upload error:', error);
      setUploadErrors(['Failed to upload files']);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-800">
      <ConversationList
        conversations={conversations}
        loading={conversationLoading}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col">
        {selectedConversation.username ? (
          <>
            <ChatHeader conversation={selectedConversation} />
            
            <MessagesArea
              messages={messages}
              loading={messagesLoading}
              selectedConversationId={selectedConversation.id}
              messagesEndRef={messagesEndRef}
              onUpdateMessage={handleUpdateMessage}
              onDeleteMessage={handleDeleteMessage}
            />
            
            {uploadErrors.length > 0 && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                {uploadErrors.map((error, index) => (
                  <p key={index} className="text-sm">{error}</p>
                ))}
              </div>
            )}
            
            <MessageInput
              messageText={messageText}
              attachments={attachments}
              filesLoading={filesLoading}
              onMessageChange={setMessageText}
              onAttachmentsChange={setAttachments}
              onFileUpload={handleFileUpload}
              onSendMessage={handleSendMessage}
              onRemoveAttachment={handleRemoveAttachment}
              fileInputRef={fileInputRef}
            />
          </>
        ) : (
          <NoConversationSelected />
        )}
      </div>
    </div>
  );
};

export default ChatsPage;