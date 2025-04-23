import React from "react";
import Icons from "../../../assets/Icons/Icons";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  icon?: "error" | "warning" | "info";
  onRetry?: () => void;
  retryButtonText?: string;
}

/**
 * A reusable error component for displaying various error states
 */
const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title = "Unable to Load Data",
  message = "An unexpected error occurred while fetching data.",
  icon = "error",
  onRetry,
  retryButtonText = "Retry",
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "error":
        return (
          <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-500 bg-red-100 rounded-full">
            <Icons variant="error" />
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center justify-center w-16 h-16 mb-4 text-orange-500 bg-orange-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      case "info":
        return (
          <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
      {renderIcon()}

      <div className="mb-6 text-center">
        <h3 className="mb-2 text-sm font-light text-gray-800">{title}</h3>
        <p className="text-xs text-gray-600">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            {retryButtonText}
          </div>
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;