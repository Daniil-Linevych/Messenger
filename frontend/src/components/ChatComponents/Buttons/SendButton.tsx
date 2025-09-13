const SendButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    Send
  </button>
);

export default SendButton;