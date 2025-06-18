import React from 'react';

export interface FilterState {
  low: boolean;
  medium: boolean;
  high: boolean;
  customOnly: boolean;
  defaultOnly: boolean;
}

interface FilterPopupProps {
  isOpen: boolean;
  position: {
    top: number;
    right: number;
  };
  filters: FilterState;
  onClose: () => void;
  onFilterChange: (filterType: keyof FilterState) => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  isOpen,
  position,
  filters,
  onClose,
  onFilterChange,
}) => {
  if (!isOpen) return null;

  const CheckIcon = () => (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const FilterMenuItem: React.FC<{
    checked: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ checked, onClick, children }) => (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={onClick}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <CheckIcon />}
      </span>
      {children}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="fixed z-50 overflow-hidden rounded-md border  border-gray-200 bg-white p-1 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 min-w-[12rem]"
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2 py-1.5 text-sm font-semibold">
          Items count:
        </div>

        {/* Count-based filters */}
        <FilterMenuItem
          checked={filters.low}
          onClick={() => onFilterChange('low')}
        >
          0-5
        </FilterMenuItem>

        <FilterMenuItem
          checked={filters.medium}
          onClick={() => onFilterChange('medium')}
        >
          6-10
        </FilterMenuItem>

        <FilterMenuItem
          checked={filters.high}
          onClick={() => onFilterChange('high')}
        >
          11+
        </FilterMenuItem>

        {/* Separator */}
        {/* <div
          role="separator"
          className="-mx-1 my-1 h-px bg-gray-200"
        /> */}

        {/* Type-based filters - Currently commented out in original */}
        {/* 
        <FilterMenuItem
          checked={filters.customOnly}
          onClick={() => onFilterChange('customOnly')}
        >
          Custom only
        </FilterMenuItem>

        <FilterMenuItem
          checked={filters.defaultOnly}
          onClick={() => onFilterChange('defaultOnly')}
        >
          Default only
        </FilterMenuItem>
        */}
      </div>
    </div>
  );
};

export default FilterPopup;