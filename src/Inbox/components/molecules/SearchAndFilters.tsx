import React from 'react';
import { SearchInput } from '../atoms/SearchInput';
import { Button } from '../atoms/Button';

export interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  onFiltersClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
      <SearchInput
        placeholder="Search"
        value={searchValue}
        onChange={onSearchChange}
      />
      
      <div className="flex items-center gap-2">
        <div className="flex h-10 items-center space-x-1 p-1 bg-white border border-gray-200 rounded-lg px-2 py-1 shrink-0 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFiltersClick}
            className="flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <span>Filters</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};