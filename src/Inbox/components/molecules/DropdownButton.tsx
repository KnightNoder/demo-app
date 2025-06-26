import React from 'react';
import { ChevronDown } from '../assets/Icons';

interface DropdownButtonProps {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  isOpen,
  onClick,
  children,
  disabled = false,
  placeholder,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
        isOpen ? 'ring-2 ring-primary' : ''
      } ${className}`}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <span className="flex items-center">
        {children || <span className="text-gray-500">{placeholder}</span>}
      </span>
      <ChevronDown/>
    </button>
  );
};