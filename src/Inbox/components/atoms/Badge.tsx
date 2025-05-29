interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'green' | 'yellow' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gray',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600', 
    yellow: 'text-yellow-600',
    gray: 'text-gray-600'
  };
  
  const sizes = {
    sm: 'text-sm font-medium',
    md: 'text-3xl font-bold',
    lg: 'text-4xl font-bold'
  };
  
  return (
    <span className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};