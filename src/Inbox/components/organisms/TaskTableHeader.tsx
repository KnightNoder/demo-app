import React from 'react';
import { SearchAndFilters } from '../molecules/SearchAndFilters';
import { FilterTabs } from '../molecules/FilterTabs';
import { Icon } from '../atoms/Icon';

export interface TaskTableHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const TaskTableHeader: React.FC<TaskTableHeaderProps> = ({
  searchValue,
  onSearchChange,
  onFiltersClick,
  activeTab,
  onTabChange,
  isExpanded,
  onToggleExpanded
}) => {
  const tabs = [
    { id: 'reminders', label: 'Reminders', icon: 'bell' as const, active: activeTab === 'reminders' },
    { id: 'review-forms', label: 'Review Forms', icon: 'document' as const, active: activeTab === 'review-forms' },
    { id: 'treatment-plans', label: 'Treatment Plan Reviews', icon: 'check-circle' as const, active: activeTab === 'treatment-plans' },
    { id: 'drfirst', label: 'DrFirst Notifications', icon: 'inbox' as const, active: activeTab === 'drfirst' },
    { id: 'messages', label: 'Messages', icon: 'chat' as const, active: activeTab === 'messages' },
    { id: 'birthdays', label: 'Birthdays', icon: 'calendar' as const, active: activeTab === 'birthdays' }
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-2 animate-scale-in">
        <div 
          className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
          onClick={onToggleExpanded}
        >
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">All Items</h2>
            <div className="ml-2 p-1 text-gray-500">
              <Icon 
                name="chevron-down" 
                className={`size-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 animate-slide-up">
            <SearchAndFilters
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              onFiltersClick={onFiltersClick}
            />
            
            <FilterTabs
              tabs={tabs}
              onTabChange={onTabChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};