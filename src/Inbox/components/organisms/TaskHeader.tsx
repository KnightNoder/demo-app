import { Heading } from "../atoms/Heading";
import { ActionControls } from "../molecules/ActionControls";

interface TaskHeaderProps {
  title?: string;
  onNewTask?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  className?: string;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  title = "Open Tasks",
  onNewTask,
  onFilter,
  onSort,
  className = ''
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 flex-wrap gap-2 ${className}`}>
      <Heading level={2}>
        {title}
      </Heading>
      
      <ActionControls 
        onNewTask={onNewTask}
        onFilter={onFilter}
        onSort={onSort}
      />
    </div>
  );
};