// components/DropdownMenu.tsx
import React from 'react';

export interface DropdownMenuItem {
  label: string;
  url: string;
}

export interface DropdownPosition {
  top: number;
  left: number;
}

interface DropdownMenuProps {
  activeButton: string | null;
  dropdownItems: DropdownMenuItem[];
  dropdownPosition: DropdownPosition;
  dropdownRef: React.RefObject<HTMLDivElement>;
  isSmallScreen: boolean;
  handleItemClick: (item: DropdownMenuItem) => void;
  setShowDropdown: (show: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  // activeButton,
  dropdownItems,
  dropdownPosition,
  dropdownRef,
  isSmallScreen,
  handleItemClick,
  // setShowDropdown
}) => {
  // For small screens, render an accordion-style dropdown
  if (isSmallScreen) {
    return (
      <div
        ref={dropdownRef}
        className="absolute bg-white border border-gray-200 rounded-md shadow-md z-50 w-64"
        style={{
          top: `${dropdownPosition.top}px`,
          right: '0', // Position from right side
          maxHeight: "70vh", // Limit height on mobile
          overflowY: "auto"
        }}
      >
        <ul className="py-1">
          {dropdownItems.map((item, index) => (
            <li key={index} className="px-2">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // For larger screens, use the standard dropdown
  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white border border-gray-200 rounded-md shadow-md z-50 w-64"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        maxHeight: "300px",
        overflowY: "auto"
      }}
    >
      <ul className="py-1">
        {dropdownItems.map((item, index) => (
          <li key={index} className="px-2">
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;