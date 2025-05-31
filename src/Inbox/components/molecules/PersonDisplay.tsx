import React from 'react';
import { Icon } from '../atoms/Icon';

export interface PersonDisplayProps {
  name: string;
  size?: 'sm' | 'md';
  variant?: 'assigned' | 'person';
  className?: string;
}

export const PersonDisplay: React.FC<PersonDisplayProps> = ({ 
  name, 
  size = 'md', 
  variant = 'person',
  className = "" 
}) => {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconColor = variant === 'assigned' ? 'text-blue-400' : 'text-gray-600';
  
  return (
    <div className={`flex items-center ${textSize} text-gray-600 ${className}`}>
      <Icon name="user" className={`${iconSize} mr-1 ${iconColor}`} />
      {name}
    </div>
  );
};