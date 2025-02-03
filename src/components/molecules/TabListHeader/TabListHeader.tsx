import React from "react";

interface Tab {
  label: string;
  count?: number;
}

interface TabListHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (label: string) => void;
}

const TabListHeader: React.FC<TabListHeaderProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div
      role="tablist"
      className="inline-flex items-center justify-start w-full gap-2 px-1 py-1 pl-2 bg-gray-100 rounded-sm h-9"
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.label}
          className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-sm w-full ${
            activeTab === tab.label
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
          onClick={() => onTabClick(tab.label)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ml-2 h-4 w-4">
              {tab.count}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabListHeader;