import React from 'react';

interface DateOptionProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const DateOption: React.FC<DateOptionProps> = ({
  selected,
  onClick,
  children
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
        selected
          ? 'bg-gray-200 border-gray-400 text-gray-700'
          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
};