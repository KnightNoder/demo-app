import React, { useEffect, useState } from "react";

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
  // setShowDropdown,
}) => {
  const [adjustedPosition, setAdjustedPosition] =
    useState<DropdownPosition>(dropdownPosition);

  // Adjust position to prevent the dropdown from going off-screen
  useEffect(() => {
    if (!isSmallScreen && dropdownRef.current) {
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      const windowWidth = window.innerWidth;

      // Calculate right edge position of the dropdown
      const rightEdge = dropdownPosition.left + dropdownWidth;

      // If the dropdown would go off the right edge of the screen
      if (rightEdge > windowWidth - 20) {
        // 20px buffer from screen edge
        const newLeft = Math.max(20, windowWidth - dropdownWidth - 20);
        setAdjustedPosition({
          top: dropdownPosition.top,
          left: newLeft,
        });
      } else {
        setAdjustedPosition(dropdownPosition);
      }
    } else {
      setAdjustedPosition(dropdownPosition);
    }
  }, [dropdownPosition, isSmallScreen, dropdownRef]);

  // For small screens, render an accordion-style dropdown
  if (isSmallScreen) {
    return (
      <div
        ref={dropdownRef}
        className="absolute bg-white border border-gray-200 rounded-md shadow-md z-50 w-64"
        style={{
          top: `${dropdownPosition.top}px`,
          right: "10px", // Position from right side
          maxHeight: "70vh", // Limit height on mobile
          overflowY: "auto",
        }}
      >
        <ul className="py-1">
          {dropdownItems.map((item, index) => (
            <li key={index} className="px-2">
              <button
                className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
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

  // For larger screens, use the standard dropdown with adjusted position
  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white border border-gray-200 rounded-md shadow-md z-50 w-56"
      style={{
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
        maxHeight: "300px",
        overflowY: "auto",
      }}
      data-testid="dropdown-menu"
    >
      <ul className="py-1">
        {dropdownItems.map((item, index) => (
          <li key={index} className="px-2">
            <button
              className="w-full text-left text-wrap px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
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
