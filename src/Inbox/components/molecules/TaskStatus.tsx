import React from 'react';
import { Badge } from '../atoms/Badge';

export interface TaskStatusProps {
  status: 'pending' | 'in-progress' | 'completed';
  size?: 'sm' | 'md';
}

export const TaskStatus: React.FC<TaskStatusProps> = ({ status, size = 'md' }) => {
  const displayText = status === 'in-progress' ? 'In Progress' : 
                     status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge variant={status} size={size}>
      {displayText}
    </Badge>
  );
};