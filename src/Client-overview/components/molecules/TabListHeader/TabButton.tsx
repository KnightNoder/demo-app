import React from "react";

interface TabButtonProps {
  label: string;
  activeTab: string;
  onClick: (label: string) => void;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  activeTab,
  onClick,
  count,
}) => {
  const isActive = activeTab === label;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isActive
          ? "bg-white text-gray-800 shadow-sm"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
      onClick={() => onClick(label)}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium leading-none ${
            isActive
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;