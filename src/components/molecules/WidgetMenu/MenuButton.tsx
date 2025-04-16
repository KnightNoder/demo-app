// components/MenuButton.tsx
import React, { useState } from 'react';
// import { DropdownMenuItem } from '../types';
export interface DropdownMenuItem {
  label: string;
  url: string;
}
interface MenuButtonProps {
  showMenuPanel: boolean;
  toggleMenuPanel: () => void;
  menuPanelRef: React.RefObject<HTMLDivElement>;
  allMenuItems: string[];
  handleButtonClick: (buttonName: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  setShowMenuPanel: (show: boolean) => void;
  activeButton: string | null;
  dropdownItems: DropdownMenuItem[];
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  handleItemClick: (item: DropdownMenuItem) => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  showMenuPanel,
  toggleMenuPanel,
  menuPanelRef,
  allMenuItems,
  handleButtonClick,
  // setShowMenuPanel,
  // activeButton,
  dropdownItems,
  showDropdown,
  setShowDropdown,
  handleItemClick
}) => {
  // Keep track of which menu item is expanded
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Handle menu item click
  const handleMenuItemClick = (menuItem: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (expandedItem === menuItem) {
      // If already expanded, collapse it
      setExpandedItem(null);
      setShowDropdown(false);
    } else {
      // Otherwise expand it and show dropdown
      setExpandedItem(menuItem);
      handleButtonClick(menuItem, e);
    }
  };

  return (
    <div className="flex-shrink-0 ml-2 relative">
      <button
        id="menu-toggle-button"
        onClick={toggleMenuPanel}
        className="flex items-center p-2 space-x-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
        aria-label="Toggle navigation menu"
        aria-expanded={showMenuPanel}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-sm transition-all duration-300 ${
              showMenuPanel ? "translate-y-1 rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-sm my-1 transition-all duration-300 ${
              showMenuPanel ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-gray-600 rounded-sm transition-all duration-300 ${
              showMenuPanel ? "-translate-y-1 -rotate-45" : ""
            }`}
          ></span>
        </div>
        <span className="font-light">Menu</span>
      </button>

      {/* Dropdown menu with accordion style */}
      {showMenuPanel && (
        <div
          ref={menuPanelRef}
          className="absolute top-[calc(100%+4px)] right-0 py-2 bg-white border border-gray-200 rounded-md shadow-md z-50 w-64"
        >
          {allMenuItems.map((menuItem) => (
            <div key={menuItem} className="relative">
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${
                  expandedItem === menuItem ? "bg-gray-50 font-medium" : ""
                }`}
                onClick={(e) => handleMenuItemClick(menuItem, e as React.MouseEvent<HTMLButtonElement>)}
                aria-expanded={expandedItem === menuItem}
              >
                <span>{menuItem}</span>
                {expandedItem === menuItem ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              
              {/* Show dropdown items directly below the button when expanded */}
              {expandedItem === menuItem && showDropdown && (
                <div className="bg-gray-50 border-t border-b border-gray-200">
                  <ul className="py-1">
                    {dropdownItems.map((item, index) => (
                      <li key={index} className="pl-8 pr-2">
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
                          onClick={() => {
                            handleItemClick(item);
                            setExpandedItem(null);
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuButton;