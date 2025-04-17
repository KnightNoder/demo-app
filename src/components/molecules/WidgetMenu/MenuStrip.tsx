// components/MenuStrip.tsx
import React from 'react';

interface MenuStripProps {
  allMenuItems: string[];
  activeButton: string | null;
  showDropdown: boolean;
  handleButtonClick: (buttonName: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MenuStrip: React.FC<MenuStripProps> = ({
  allMenuItems,
  activeButton,
  showDropdown,
  handleButtonClick
}) => {
  return (
    <div
      className="ml-2 flex h-10 items-center space-x-1 bg-white rounded-md"
      role="menubar"
      tabIndex={0}
      data-orientation="horizontal"
      style={{ outline: "none" }}
    >
      {allMenuItems.map((menuItem) => (
        <button
          key={menuItem}
          type="button"
          role="menuitem"
          id={`radix-${menuItem.toLowerCase().replace(/\s+/g, "-")}`}
          aria-haspopup="menu"
          aria-expanded={activeButton === menuItem && showDropdown}
          data-state={
            activeButton === menuItem && showDropdown ? "open" : "closed"
          }
          className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${
            activeButton === menuItem ? "bg-gray-100" : ""
          }`}
          tabIndex={activeButton === menuItem ? 0 : -1}
          data-orientation="horizontal"
          data-radix-collection-item=""
          onClick={(e) => handleButtonClick(menuItem, e)}
        >
          {menuItem}
        </button>
      ))}
    </div>
  );
};

export default MenuStrip;