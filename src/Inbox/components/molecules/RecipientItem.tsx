import React from 'react';
import { Checkbox } from '../atoms/Checkbox';

interface RecipientItemProps {
  recipient: {
    id: number;
    name: string;
    role?: string;
    type?: 'staff' | 'group';
  };
  isSelected: boolean;
  onToggle: () => void;
}

export const RecipientItem: React.FC<RecipientItemProps> = ({
  recipient,
  isSelected,
  onToggle
}) => {
  return (
    <li
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md mx-1 mb-1 transition-colors ${
        isSelected
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-gray-50'
      }`}
      role="option"
      aria-selected={isSelected}
      onClick={onToggle}
    >
      <Checkbox checked={isSelected} onChange={onToggle} />
      <div className="flex-1 min-w-0">
        <span
          className={`font-medium text-sm block truncate ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}
        >
          {recipient.name}
        </span>
        {recipient.role && (
          <span
            className={`text-xs block truncate mt-0.5 ${
              isSelected ? 'text-blue-700' : 'text-gray-500'
            }`}
          >
            {recipient.role}
          </span>
        )}
      </div>
    </li>
  );
};