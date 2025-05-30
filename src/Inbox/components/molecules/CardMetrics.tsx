import { Badge } from "../atoms/Badge";

interface CardMetricsProps {
  count: number | string;
  variant?: "red" | "orange" | "green" | "yellow" | "gray";
  className?: string;
}

export const CardMetrics: React.FC<CardMetricsProps> = ({ 
  count, 
  variant = 'red',
  className = '' 
}) => {
  return (
    <div className={`mt-2 flex justify-between items-end z-10 relative ${className}`}>
      <div>
        <Badge variant={variant} size="md">
          {count}
        </Badge>
      </div>
    </div>
  );
};