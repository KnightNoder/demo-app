import React from 'react';
import { Icon } from '../atoms/Icon';

export interface FilterTabProps {
  id: string;
  label: string;
  icon: 'bell' | 'document' | 'check-circle' | 'calendar' | 'inbox' | 'chat';
  active?: boolean;
  onClick: (id: string) => void;
}

export const FilterTab: React.FC<FilterTabProps> = ({ id, label, icon, active = false, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-white text-gray-900 shadow-sm scale-105"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102"
      }`}
    >
      <Icon name={icon} className="size-4" />
      {label}
    </button>
  );
};