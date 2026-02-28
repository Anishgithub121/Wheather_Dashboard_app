import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 items-center space-x-3 text-red-600 dark:text-red-400">
      <AlertCircle className="w-6 h-6 flex-shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}
