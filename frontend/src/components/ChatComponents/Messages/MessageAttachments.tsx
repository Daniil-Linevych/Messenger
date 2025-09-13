import type { FileAttachment } from "../../../types/file";
import { useState } from 'react';

const MessageAttachments = ({ attachments }: { attachments: FileAttachment[] }) => {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (file: FileAttachment, index: number) => {
    setDownloading(index);
    
    try {
      const backendUrl = import.meta.env.BACKEND_HTTP_API_URL || 'http://localhost:8000/api/v1';
      const fileUrl = `${backendUrl}/uploads/${file.file_name}`;
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.original_file_name || file.file_name || `file-${file.id}`;
      
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((file, index) => (
        <div 
          key={index} 
          className={`flex items-center p-2 bg-black/10 rounded cursor-pointer hover:bg-black/20 transition-colors ${
            downloading === index ? 'opacity-70' : ''
          }`}
          onClick={() => handleDownload(file, index)}
        >
          {downloading === index ? (
            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          )}
          
          <span className="text-sm truncate flex-1">{file.original_file_name}</span>
          
          {downloading === index && (
            <span className="text-xs text-gray-500 ml-2">Downloading...</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageAttachments;