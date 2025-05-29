interface AvatarProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gray';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  children, 
  size = 'md',
  variant = 'default',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8'
  };
  
  const variants = {
    default: 'bg-blue-100',
    gray: 'bg-gray-50'
  };
  
  return (
    <div className={`${sizes[size]} rounded-full ${variants[variant]} flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};