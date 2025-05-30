import { CardContainer } from "../molecules/CardContainer";
import { CardHeader } from "../molecules/CardHeader";
import { CardMetrics } from "../molecules/CardMetrics";

interface TaskCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  variant?: 'urgent' | 'normal' | 'completed' | 'in-progress';
  gradient?: 'pink-blue' | 'blue-purple' | 'green-blue' | 'yellow-orange';
  onClick?: () => void;
  ariaLabel?: string;
  testId?: string;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  count,
  icon,
  variant = 'normal',
  gradient = 'pink-blue',
  onClick,
  ariaLabel,
  testId,
  className = ''
}) => {
  const variantColors = {
    urgent: "red" as const,
    normal: "orange" as const,
    completed: "green" as const,
    "in-progress": "yellow" as const,
  };
  
  return (
    <CardContainer
      gradient={gradient}
      onClick={onClick}
      ariaLabel={ariaLabel || title}
      testId={testId}
      className={className}
    >
      <CardHeader 
        icon={icon}
        title={title}
      />
      
      <CardMetrics 
        count={count}
        variant={variantColors[variant]}
      />
    </CardContainer>
  );
};