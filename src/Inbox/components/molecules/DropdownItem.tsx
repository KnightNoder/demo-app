import React from 'react';

interface DropdownItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  children,
  className = ''
}) => {
  return (
    <div
      className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};