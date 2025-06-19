import React from "react";
import { Icon } from "../atoms/Icon";

export interface TaskTableHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
  onExportCSV: () => void; // Added CSV export prop
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

// CSV Export Button Component
const CSVExportButton: React.FC<{ onExportCSV: () => void }> = ({
  onExportCSV,
}) => {
  return (
    <button
      onClick={onExportCSV}
      className="flex cursor-default select-none items-center rounded-lg border border-input px-4 py-2 text-sm font-medium outline-none hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] transition-colors duration-200"
      title="Export to CSV"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Export CSV</span>
      </div>
    </button>
  );
};

export const TaskTableHeader: React.FC<TaskTableHeaderProps> = ({
  searchValue,
  onSearchChange,
  onFiltersClick,
  onExportCSV,
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
      id: "birthdays",
      label: "Birthdays",
      icon: "calendar" as const,
      active: activeTab === "birthdays",
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: "calendar" as const,
      active: activeTab === "agenda",
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-white overflow-hidden animate-scale-in">
        <div
          className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
          onClick={onToggleExpanded}
        >
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">All Items</h2>
            <div className="ml-2 p-1 text-gray-500">
              <Icon
                name="chevron-down"
                className={`size-5 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pt-4 animate-slide-up">
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
                  className="flex cursor-default select-none items-center rounded-lg border border-input px-4 py-2 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] transition-colors duration-200"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  onClick={onFiltersClick}
                >
                  <div className="flex items-center gap-2">
                    <span>Filters</span>
                  </div>
                </button>

                <CSVExportButton onExportCSV={onExportCSV} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};