import React from 'react';
import { TaskPriority } from '../molecules/TaskPriority';
import { TaskStatus } from '../molecules/TaskStatus';
import { TaskActions } from '../molecules/TaskAction';
import { TimeDisplay } from '../molecules/TimeDisplay';
import { PersonDisplay } from '../molecules/PersonDisplay';

export interface Task {
  id: string;
  title: string;
  description: string;
  message?: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "pending" | "completed" | "in-progress" | "Read" | "New" | "Done";
  assignedTo: string;
  person: string;
  [key: string]: any; // Allow additional dynamic properties
}

export interface TaskCardProps {
  task: Task;
  columns: { key: string; label: string; }[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  columns,
  onReply, 
  onComplete, 
  className = "" 
}) => {
  const handleReply = () => onReply(task.id);
  const handleComplete = () => onComplete(task.id);
  
  // Helper function to check if a column exists
  const hasColumn = (columnKey: string) => {
    return columns.some(col => col.key === columnKey);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
          {task.title || <span className="text-gray-400 italic">No subject</span>}
        </h3>
        {hasColumn('priority') && <TaskPriority priority={task.priority} size="sm" />}
      </div>
      
      {hasColumn('description') || hasColumn('message') ? (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description || task.message}
        </p>
      ) : null}
      
      {(hasColumn('dueDate') || hasColumn('assignedTo')) && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {hasColumn('dueDate') && <TimeDisplay time={task.dueDate} size="sm" />}
          {hasColumn('assignedTo') && <PersonDisplay name={task.assignedTo} size="sm" variant="assigned" />}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        {hasColumn('status') && <TaskStatus status={task.status} size="sm" />}
        <TaskActions onReply={handleReply} onComplete={handleComplete} size="sm" />
      </div>
    </div>
  );
};