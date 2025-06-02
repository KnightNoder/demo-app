import React from 'react';
import { TaskCard, Task } from './TaskDetailCard';

export interface MobileTaskListProps {
  tasks: Task[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const MobileTaskList: React.FC<MobileTaskListProps> = ({ 
  tasks, 
  onReply, 
  onComplete 
}) => {
  return (
    <div className="sm:hidden w-full">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="w-full"
        >
          <TaskCard task={task} onReply={onReply} onComplete={onComplete} />
        </div>
      ))}
      <div className="flex justify-between items-center text-sm text-gray-500 px-2 mt-4">
        <div>Showing {tasks.length} tasks</div>
      </div>
    </div>
  );
};