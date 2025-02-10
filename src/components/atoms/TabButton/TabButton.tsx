import React from "react";
import Button from "../../atoms/Button/Button";  // Importing the Button atom

interface TabButtonProps {
  label: string;
  activeTab: string;
  onClick: (label: string) => void;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ label, activeTab, onClick, count }) => {
  return (
    <Button
      variant="default" data-cy="default-button"
      onClick={() => onClick(label)}
      disabled={false}
      className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-sm w-full ${activeTab === label
        ? "bg-white text-zinc-900 shadow-sm"
        : "text-zinc-500 hover:text-zinc-900"
        }`}
    >
      {label}
      {count !== undefined && (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ml-2 h-4 w-4">
          {count}
        </div>
      )}
    </Button>
  );
};

export default TabButton;
