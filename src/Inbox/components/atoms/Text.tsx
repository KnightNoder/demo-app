interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'caption' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'gray-800' | 'gray-600' | 'gray-500';
  className?: string;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body',
  weight = 'normal',
  color = 'gray-800',
  className = '' 
}) => {
  const variants = {
    body: 'text-sm md:text-xs lg:text-sm',
    caption: 'text-xs',
    label: 'text-sm'
  };
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  const colors = {
    'gray-800': 'text-gray-800',
    'gray-600': 'text-gray-600', 
    'gray-500': 'text-gray-500'
  };
  
  return (
    <span className={`${variants[variant]} ${weights[weight]} ${colors[color]} text-left line-clamp-2 ${className}`}>
      {children}
    </span>
  );
};
