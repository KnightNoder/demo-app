interface IconProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  children, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };
  
  return (
    <div className={`${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};