import React from "react";
import { Icon } from "../atoms/Icon";

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
  onToggleExpanded,
}) => {
  const tabs = [
    {
      id: "reminders",
      label: "Reminders",
      icon: "bell" as const,
      active: activeTab === "reminders",
    },
    {
      id: "review-forms",
      label: "Review Forms",
      icon: "document" as const,
      active: activeTab === "review-forms",
    },
    {
      id: "treatment-plans",
      label: "Treatment Plan Reviews",
      icon: "check-circle" as const,
      active: activeTab === "treatment-plans",
    },
    {
      id: "drfirst",
      label: "DrFirst Notifications",
      icon: "inbox" as const,
      active: activeTab === "drfirst",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "chat" as const,
      active: activeTab === "messages",
    },
    {
      id: "birthdays",
      label: "Birthdays",
      icon: "calendar" as const,
      active: activeTab === "birthdays",
    },
  ];

  return (
    <div className="mb-6 w-full">
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
                className={`size-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <input
                type="text"
                className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-64"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />

              <div className="flex-1 min-w-0 overflow-x-auto">
                <div className="flex overflow-x-auto scrollbar-none w-full">
                  <div className="flex gap-1 p-1 bg-gray-50 rounded-lg min-w-fit">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                          tab.active
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        }`}
                      >
                        <span className="w-4 h-4">
                          <Icon name={tab.icon} className="size-4" />
                        </span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                  className="flex cursor-default select-none items-center rounded-lg border border-input px-4 py-2 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  onClick={onFiltersClick}
                >
                  <div className="flex items-center gap-2">
                    <span>Filters</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
