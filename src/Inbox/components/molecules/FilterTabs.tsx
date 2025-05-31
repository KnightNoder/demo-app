import React from 'react';
import { FilterTab, FilterTabProps } from './FilterTab';

export interface FilterTabsProps {
  tabs: Omit<FilterTabProps, 'onClick'>[];
  onTabChange: (tabId: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, onTabChange }) => {
  return (
    <div className="flex-1 min-w-0 overflow-x-auto">
      <div className="flex overflow-x-auto scrollbar-none w-full">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-lg min-w-fit animate-fade-in">
          {tabs.map((tab) => (
            <FilterTab
              key={tab.id}
              {...tab}
              onClick={onTabChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};