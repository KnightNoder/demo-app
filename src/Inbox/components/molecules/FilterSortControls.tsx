import { MenuItem } from "../atoms/MenuItem";
import { MenuBar } from "./MenuBar";

interface FilterSortControlsProps {
  onFilter?: () => void;
  onSort?: () => void;
}

export const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  onFilter,
  onSort
}) => {
  return (
    <MenuBar>
      <MenuItem onClick={onFilter}>Filter</MenuItem>
      <MenuItem onClick={onSort}>Sort</MenuItem>
    </MenuBar>
  );
};