import React from "react";
import TabButton from "../../atoms/TabButton/TabButton";  // Importing the TabButton atom

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
        <TabButton
          key={tab.label}
          label={tab.label}
          activeTab={activeTab}
          onClick={onTabClick}
          count={tab.count}
        />
      ))}
    </div>
  );
};

export default TabListHeader;
