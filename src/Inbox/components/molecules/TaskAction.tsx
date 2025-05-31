import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface TaskActionsProps {
  onReply: () => void;
  onComplete: () => void;
  size?: 'sm' | 'md';
}

export const TaskActions: React.FC<TaskActionsProps> = ({ onReply, onComplete, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-6';
  
  return (
    <div className="flex gap-2 items-center justify-end">
      <Button 
        variant="link" 
        size={size} 
        onClick={onReply}
        title="Reply to task"
      >
        Reply
      </Button>
      <Button 
        variant="ghost" 
        size={size} 
        onClick={onComplete} 
        title="Complete task"
        className={`${size === 'sm' ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-50 hover:scale-110 transition-all duration-200`}
      >
        <Icon name="check" className={`${iconSize} text-green-500 hover:text-green-600`} />
      </Button>
    </div>
  );
};