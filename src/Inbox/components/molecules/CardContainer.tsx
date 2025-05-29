interface CardContainerProps {
  children: React.ReactNode;
  gradient?: 'pink-blue' | 'blue-purple' | 'green-blue' | 'yellow-orange';
  onClick?: () => void;
  ariaLabel?: string;
  testId?: string;
  className?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({ 
  children,
  gradient = 'pink-blue',
  onClick,
  ariaLabel,
  testId,
  className = '' 
}) => {
  const gradients = {
    'pink-blue': 'bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50',
    'blue-purple': 'bg-gradient-to-br from-blue-50 via-purple-50 to-purple-50',
    'green-blue': 'bg-gradient-to-br from-green-50 via-blue-50 to-blue-50',
    'yellow-orange': 'bg-gradient-to-br from-yellow-50 via-orange-50 to-orange-50'
  };
  
  return (
    <div className={`cursor-pointer w-full sm:w-[180px] md:w-[220px] flex-shrink-0 p-0.5 ${className}`}>
      <div 
        className={`relative rounded-xl border-2 border-white ring-2 ring-inset ring-white/80 ${gradients[gradient]} hover:scale-[1.03] hover:border-blue-200 hover:z-10 transition-all duration-200 cursor-pointer group p-3 h-full flex flex-col`}
        tabIndex={0}
        aria-label={ariaLabel}
        data-testid={testId}
        onClick={onClick}
      >
        <div className="absolute inset-0 rounded-xl bg-white/70 pointer-events-none z-0 group-hover:bg-white/80"></div>
        {children}
      </div>
    </div>
  );
};