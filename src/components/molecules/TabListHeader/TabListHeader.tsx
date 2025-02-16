import React from "react";
import TabButton from "../../atoms/TabButton/TabButton";  // Importing the TabButton atom


interface Tab {
  label: "summary" | "coverage" | "financials"; // Explicitly type allowed tab labels
  count?: number;
}

interface TabListHeaderProps {
  tabs: Tab[]; // Use the defined Tab type
  activeTab: "summary" | "coverage" | "financials";
  onTabClick: (label: "summary" | "coverage" | "financials") => void;
}

interface TabListHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (label: string) => void;  // Ensure correct function name
}

const TabListHeader: React.FC<TabListHeaderProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div
      role="tablist"
      className="sticky top-0 z-10 inline-flex items-center justify-start w-full gap-2 px-1 pl-2 bg-gray-100 rounded-sm h-9"
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
