import React, { memo } from 'react';

interface ErrorRetryDisplayProps {
  error: string | null;
  onRetry: () => void;
  className?: string;
}

const ErrorRetryDisplay: React.FC<ErrorRetryDisplayProps> = memo(({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  if (!error) return null;

  return (
    <div className={`text-red-600 text-sm mb-2 ${className}`}>
      {error}
      <button
        onClick={onRetry}
        className="ml-2 text-blue-600 hover:text-blue-800 underline"
      >
        Retry
      </button>
    </div>
  );
});

ErrorRetryDisplay.displayName = 'ErrorRetryDisplay';

export default ErrorRetryDisplay;