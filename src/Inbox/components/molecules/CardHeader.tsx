import { Avatar } from "../atoms/Avatar";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  icon, 
  title,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-2 z-10 relative ${className}`}>
      <Avatar variant="gray">
        <div className="text-gray-500">
          <Icon>{icon}</Icon>
        </div>
      </Avatar>
      <Text variant="body" weight="medium" color="gray-800">
        {title}
      </Text>
    </div>
  );
};