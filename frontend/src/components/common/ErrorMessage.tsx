interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }:ErrorMessageProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
      {message}
    </div>
  );
};

export default ErrorMessage;