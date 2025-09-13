import React from 'react';

interface FileUploadButtonProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

const FileUploadButton = ({ onFileUpload, fileInputRef, disabled }: FileUploadButtonProps) => {
  return (
    <>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white disabled:opacity-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        multiple
        className="hidden"
        disabled={disabled}
      />
    </>
  );
};

export default FileUploadButton;