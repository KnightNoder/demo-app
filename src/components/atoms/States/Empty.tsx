import React from "react";

interface EmptyStateComponentProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  isAnyModalOpen?: boolean; // Optional prop to handle modal state
}

/**
 * A reusable component for displaying empty state when no data is available
 */
const EmptyStateComponent: React.FC<EmptyStateComponentProps> = ({
  title = "No Data Found",
  message = "No data is available.",
  icon,
  isAnyModalOpen,
}) => {
  const defaultIcon = (
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
  );

  return (
    <div
      className={`p-6 text-center bg-white rounded-lg ${isAnyModalOpen ? "h-[500px]" : "h-[270px]"}  flex flex-col items-center justify-center`}
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-500 bg-blue-100 rounded-full">
        {icon || defaultIcon}
      </div>
      <h3 className="mb-2 text-sm font-light text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyStateComponent;