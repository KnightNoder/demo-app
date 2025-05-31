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
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  person: string;
}

export interface TaskCardProps {
  task: Task;
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onReply, 
  onComplete, 
  className = "" 
}) => {
  const handleReply = () => onReply(task.id);
  const handleComplete = () => onComplete(task.id);

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
          {task.title || <span className="text-gray-400 italic">No subject</span>}
        </h3>
        <TaskPriority priority={task.priority} size="sm" />
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <TimeDisplay time={task.dueDate} size="sm" />
        <PersonDisplay name={task.assignedTo} size="sm" variant="assigned" />
      </div>
      
      <div className="flex items-center justify-between">
        <TaskStatus status={task.status} size="sm" />
        <TaskActions onReply={handleReply} onComplete={handleComplete} size="sm" />
      </div>
    </div>
  );
};