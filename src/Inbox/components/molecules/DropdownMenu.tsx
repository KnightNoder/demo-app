import React from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-96 overflow-auto ${className}`}
    >
      {children}
    </div>
  );
};