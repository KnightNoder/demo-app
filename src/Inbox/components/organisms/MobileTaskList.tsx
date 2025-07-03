import React from 'react';
import { TaskCard } from "./TaskDetailCard";
import { ExtendedTask } from "./TaskManagementContainer";

export interface MobileTaskListProps {
  tasks: ExtendedTask[];
  columns: { key: string; label: string; }[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const MobileTaskList: React.FC<MobileTaskListProps> = ({
  tasks,
  columns,
  onReply,
  onComplete,
}) => {
  return (
    <div className="task-list-mobile w-full">
      {tasks.map((task, index) => (
        <div
          key={`${task.id}-${index}`} // Make key unique by combining id and index
          style={{ animationDelay: `${index * 50}ms` }}
          className="w-full"
        >
          <TaskCard task={task} columns={columns} onReply={onReply} onComplete={onComplete} />
        </div>
      ))}
      <div className="flex justify-between items-center text-sm text-gray-500 px-2 mt-4">
        <div>Showing {tasks.length} tasks</div>
      </div>
    </div>
  );
};