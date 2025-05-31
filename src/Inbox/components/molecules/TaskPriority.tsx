import React from 'react';
import { Badge } from '../atoms/Badge';

export interface TaskPriorityProps {
  priority: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
}

export const TaskPriority: React.FC<TaskPriorityProps> = ({ priority, size = 'md' }) => {
  const displayText = priority.charAt(0).toUpperCase() + priority.slice(1);
  
  return (
    <Badge variant={priority} size={size}>
      {displayText}
    </Badge>
  );
};