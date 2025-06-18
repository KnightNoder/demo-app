import React from 'react';

export interface SortState {
  field: 'priority' | 'count' | 'label';
  direction: 'asc' | 'desc';
}

export type SortOption = 
  | 'priority-high-to-low'
  | 'priority-low-to-high'
  | 'count-high-to-low'
  | 'count-low-to-high'
  | 'label-a-to-z'
  | 'label-z-to-a';

interface SortPopupProps {
  isOpen: boolean;
  position: {
    top: number;
    right: number;
  };
  currentSort: SortOption;
  onClose: () => void;
  onSortChange: (sortOption: SortOption) => void;
}

const SortPopup: React.FC<SortPopupProps> = ({
  isOpen,
  position,
  currentSort,
  onClose,
  onSortChange,
}) => {
  if (!isOpen) return null;

  const RadioIcon = ({ checked }: { checked: boolean }) => {
    if (!checked) return null;
    
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-2 w-2 fill-current"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  };

  const SortMenuItem: React.FC<{
    value: SortOption;
    checked: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ value, checked, onClick, children }) => (
    <div
      role="menuitemradio"
      aria-checked={checked}
      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      data-state={checked ? "checked" : "unchecked"}
      onClick={onClick}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadioIcon checked={checked} />
      </span>
      {children}
    </div>
  );

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'priority-high-to-low', label: 'Priority (high to low)' },
    { value: 'priority-low-to-high', label: 'Priority (low to high)' },
    { value: 'count-high-to-low', label: 'Count (high to low)' },
    { value: 'count-low-to-high', label: 'Count (low to high)' },
    { value: 'label-a-to-z', label: 'Label (A to Z)' },
    { value: 'label-z-to-a', label: 'Label (Z to A)' },
  ];

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="fixed z-50 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 min-w-[12rem]"
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2 py-1.5 text-sm font-semibold">
          Sort by:
        </div>

        <div role="group">
          {sortOptions.map((option) => (
            <SortMenuItem
              key={option.value}
              value={option.value}
              checked={currentSort === option.value}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </SortMenuItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortPopup;