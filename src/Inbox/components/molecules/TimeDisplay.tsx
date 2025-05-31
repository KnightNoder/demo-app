import React from 'react';
import { Icon } from '../atoms/Icon';

export interface TimeDisplayProps {
  time: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ time, size = 'md', className = "" }) => {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className={`flex items-center ${textSize} text-gray-600 ${className}`}>
      <Icon name="clock" className={`${iconSize} mr-1 text-gray-400`} />
      {time}
    </div>
  );
};