import React, { useState, useMemo } from 'react';
import { TaskTableHeader } from './TaskTableHeader';
import { AGGridTable } from './AGGridTable';
import { MobileTaskList } from './MobileTaskList';
import { Task } from './TaskDetailCard';

export interface TaskManagementContainerProps {
  tasks: Task[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskManagementContainer: React.FC<TaskManagementContainerProps> = ({
  tasks,
  onReply,
  onComplete,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("reminders");
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.person.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [tasks, searchValue]);

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

        <AGGridTable
          tasks={filteredTasks}
          onReply={onReply}
          onComplete={onComplete}
        />

        <MobileTaskList
          tasks={filteredTasks}
          onReply={onReply}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};