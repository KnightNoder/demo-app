import React, { useState, useMemo } from 'react';
import { TaskTableHeader } from './TaskTableHeader';
import { AGGridTable } from './AGGridTable';
import { MobileTaskList } from './MobileTaskList';

// Extended task interface with index signature for dynamic properties
export interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  person: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'in-progress';
  type: string;
  [key: string]: any; // This allows dynamic property access
}

// Import the ApiColumn interface
export interface ApiColumn {
  key: string;
  label: string;
}

export interface TaskManagementContainerProps {
  tasks: ExtendedTask[];
  columns?: ApiColumn[]; // Add optional columns prop
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskManagementContainer: React.FC<TaskManagementContainerProps> = ({
  tasks,
  columns = [], // Default to empty array if not provided
  onReply,
  onComplete,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("reminders");
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Dynamic search across all column keys from API
      const searchLower = searchValue.toLowerCase();

      // Search in standard task fields
      const standardFieldsMatch =
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower) ||
        task.person?.toLowerCase().includes(searchLower);

      // Search in dynamic columns from API
      const dynamicFieldsMatch = columns.some((column) => {
        const fieldValue = task[column.key];
        return (
          fieldValue && String(fieldValue).toLowerCase().includes(searchLower)
        );
      });

      return standardFieldsMatch || dynamicFieldsMatch;
    });
  }, [tasks, searchValue, columns]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleFiltersClick = () => {
    console.log("Filters clicked");
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="w-full mx-auto">
        <TaskTableHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onFiltersClick={handleFiltersClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
        />

        {isExpanded && (
          <>
            <AGGridTable
              tasks={filteredTasks}
              columns={columns}
              onReply={onReply}
              onComplete={onComplete}
            />

            <MobileTaskList
              tasks={filteredTasks}
              onReply={onReply}
              onComplete={onComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};