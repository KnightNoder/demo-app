import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className = ''
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 ${
        checked
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
    >
      {checked && (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      )}
    </div>
  );
};