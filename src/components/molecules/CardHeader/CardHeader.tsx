import React from "react";
import Icons from "../../../assets/Icons/Icons";

interface HeaderProps {
  title: string;
  isCollapsed: boolean;
  handleCollapse: () => void;
  handleExpandModal: (e?: React.MouseEvent) => void;
  isKebabMenuOpen: boolean;
  toggleKebabMenu: () => void;
  kebabMenuRef: React.RefObject<HTMLDivElement>;
  icon?: string | undefined;
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  iconBgColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  isCollapsed,
  handleCollapse,
  handleExpandModal,
  isKebabMenuOpen,
  toggleKebabMenu,
  kebabMenuRef,
  icon,
  onMouseDown,
  isDragging,
  iconBgColor,
}) => {
  // Ensure event propagation is stopped
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleExpandModal(e);
  };

  // Add stopPropagation to the collapse button too
  const handleCollapseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCollapse();
  };

  // Add stopPropagation to the kebab menu toggle
  const handleKebabMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleKebabMenu();
  };

  return (
    <div
      className={`rounded-4xl flex items-center justify-between p-4 bg-white header drag-handle ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={onMouseDown}
    >
      <h3 className="flex items-center justify-center font-medium">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${iconBgColor}`}
        >
          <Icons variant={icon} />
        </div>
        <span className="ml-2 font-light"> {title}</span>
      </h3>
      <div className="flex items-center gap-1">
        <button
          onClick={handleCollapseClick}
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
          onClick={handleExpandClick}
          data-testid="expand-icon"
          className="p-1 transition-colors rounded-md hover:bg-gray-100"
        >
          <Icons variant="modalExpand" />
        </button>
        <button
          className="relative p-1 transition-colors rounded-md hover:bg-gray-100"
          type="button"
          onClick={handleKebabMenuClick}
        >
          <Icons variant="kebab-menu" />
          {isKebabMenuOpen && (
            <div
              ref={kebabMenuRef}
              className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <div className="py-1">
                <button
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icons variant="download" />
                  Export
                </button>
                <button
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icons variant="print" />
                  Print
                </button>
                <button
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icons variant="share" />
                  Share
                </button>
                <button
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                  disabled
                  onClick={(e) => e.stopPropagation()}
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