import { Button } from "../atoms/Button";
import { FilterSortControls, FilterState } from "./FilterSortControls";

interface ActionControlsProps {
  onNewTask?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  filters?: FilterState;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onNewTask,
  onFilter,
  onSort,
  filters
}) => {
  return (
    <div className="flex items-center gap-2 relative overflow-visible">
      <FilterSortControls onFilter={onFilter} onSort={onSort} filters={filters} />
      <Button onClick={onNewTask}>
        New Task
      </Button>
    </div>
  );
};