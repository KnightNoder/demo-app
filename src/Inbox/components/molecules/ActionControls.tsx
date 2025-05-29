import { Button } from "../atoms/Button";
import { FilterSortControls } from "./FilterSortControls";

interface ActionControlsProps {
  onNewTask?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onNewTask,
  onFilter,
  onSort
}) => {
  return (
    <div className="flex items-center gap-2 relative overflow-visible">
      <FilterSortControls onFilter={onFilter} onSort={onSort} />
      <Button onClick={onNewTask}>
        New Task
      </Button>
    </div>
  );
};