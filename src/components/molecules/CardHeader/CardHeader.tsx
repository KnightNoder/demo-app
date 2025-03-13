import React from "react";
import Icons from "../../../assets/Icons/Icons";

interface HeaderProps {
  title: string;
  isCollapsed: boolean;
  handleCollapse: () => void;
  handleExpandModal: () => void;
  isKebabMenuOpen: boolean;
  toggleKebabMenu: () => void;
  kebabMenuRef: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({
  title,
  isCollapsed,
  handleCollapse,
  handleExpandModal,
  isKebabMenuOpen,
  toggleKebabMenu,
  kebabMenuRef,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white cursor-move header drag-handle">
      <h3 className="font-medium">{title}</h3>
      <div className="flex items-center gap-1">
        <button
          onClick={handleCollapse}
          data-testid="collapse-button"
          className="p-1 transition-colors rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <Icons variant="collapseUp" />
          ) : (
            <Icons variant="collapseDown" />
          )}
        </button>
        <button
          onClick={handleExpandModal}
          data-testid="expand-icon"
          className="p-1 transition-colors rounded-md hover:bg-gray-100"
        >
          <Icons variant="modalExpand" />
        </button>
        <button
          className="relative p-1 transition-colors rounded-md hover:bg-gray-100"
          type="button"
          onClick={toggleKebabMenu}
        >
          <Icons variant="kebab-menu" />
          {isKebabMenuOpen && (
            <div
              ref={kebabMenuRef}
              className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <div className="py-1">
                <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                  <Icons variant="download" />
                  Export
                </button>
                <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                  <Icons variant="print" />
                  Print
                </button>
                <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                  <Icons variant="share" />
                  Share
                </button>
                <button
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                  disabled
                >
                  <Icons variant="delete" />
                  Cannot Delete Default Widget
                </button>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
