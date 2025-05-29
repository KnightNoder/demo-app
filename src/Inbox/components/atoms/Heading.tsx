interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ 
  level = 2, 
  children, 
  className = '' 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const styles = {
    1: "text-3xl font-bold",
    2: "text-lg font-semibold",
    3: "text-base font-semibold",
    4: "text-sm font-semibold",
    5: "text-xs font-semibold",
    6: "text-xs font-medium"
  };
  
  return (
    <Tag className={`${styles[level]} text-gray-800 ${className}`}>
      {children}
    </Tag>
  );
};