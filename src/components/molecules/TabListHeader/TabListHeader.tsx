import React from "react";
import TabButton from "../../atoms/TabButton/TabButton";

interface Tab {
  key?: string;
  label: string;
  count?: number;
}

interface TabListHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (label: string) => void;
}

const TabListHeader: React.FC<TabListHeaderProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  return (
    <div
      role="tablist"
      className="sticky top-0 z-10 inline-flex items-center justify-start w-full gap-2 px-1 pl-2 bg-gray-100 rounded-sm h-9"
      style={{ position: "sticky", top: 0 }}
    >
      {tabs.map((tab, index) => (
        <TabButton
          key={tab.key || `tab-${tab.label}-${index}`}
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