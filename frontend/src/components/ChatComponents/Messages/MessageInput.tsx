import AttachmentsPreview from "../Attachments/AttachmentsPreview";
import type { FileAttachment } from "../../../types/file";
import FileUploadButton from "../Buttons/FileUploadButton";
import SendButton from "../Buttons/SendButton";
import React from 'react';

interface MessageInputProps {
  messageText: string;
  attachments: FileAttachment[];
  filesLoading: boolean;
  onMessageChange: (text: string) => void;
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onRemoveAttachment: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const MessageInput = ({
  messageText,
  attachments,
  filesLoading,
  onMessageChange,
  onFileUpload,
  onSendMessage,
  onRemoveAttachment,
  fileInputRef,
}: MessageInputProps) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 p-4">
      <AttachmentsPreview
        attachments={attachments} 
        onRemoveAttachment={onRemoveAttachment}
      />
      
      <div className="flex space-x-2">
        <FileUploadButton 
          onFileUpload={onFileUpload} 
          fileInputRef={fileInputRef}
          disabled={filesLoading}
        />
        
        <div className="flex-1 bg-gray-100 dark:bg-neutral-700 rounded-lg">
          <textarea
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none focus:ring-0 py-2 px-3 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400"
          />
        </div>
        
        <SendButton 
          disabled={(!messageText.trim() && attachments.length === 0) || filesLoading}
          onClick={onSendMessage}
        />
      </div>
    </div>
  );
};

export default MessageInput;