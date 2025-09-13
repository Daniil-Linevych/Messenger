import type { FileAttachment } from "../../../types/file";

interface AttachmentsPreviewProps {
  attachments: FileAttachment[];
  onRemoveAttachment: (index: number) => void;
}

const AttachmentsPreview = ({ attachments, onRemoveAttachment }: AttachmentsPreviewProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {attachments.map((file, index) => (
        <div key={index} className="flex items-center bg-gray-200 dark:bg-neutral-700 rounded-lg px-3 py-1">
          <span className="text-sm text-gray-700 dark:text-neutral-300 mr-2 truncate max-w-xs">
            {file.file_name}
          </span>
          <button 
            onClick={() => onRemoveAttachment(index)}
            className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentsPreview;