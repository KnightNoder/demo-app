import { MenuItem } from "../atoms/MenuItem";
import { MenuBar } from "./MenuBar";

export interface FilterState {
  low: boolean;
  medium: boolean;
  high: boolean;
  customOnly: boolean;
  defaultOnly: boolean;
}

interface FilterSortControlsProps {
  onFilter?: () => void;
  onSort?: () => void;
  filters?: FilterState;
}

export const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  onFilter,
  onSort,
  filters
}) => {
  // Helper function to get active filter count
  const getActiveFilterCount = (filters?: FilterState): number => {
    if (!filters) return 0;
    return Object.values(filters).filter(Boolean).length;
  };

  const activeFilterCount = getActiveFilterCount(filters);
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <MenuBar>
      <MenuItem 
        onClick={onFilter}
        className={hasActiveFilters ? "relative" : ""}
      >
        <div className="flex items-center gap-1">
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
      </MenuItem>
      <MenuItem onClick={onSort}>Sort</MenuItem>
    </MenuBar>
  );
};