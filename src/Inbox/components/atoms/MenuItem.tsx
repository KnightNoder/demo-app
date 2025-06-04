interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ 
  children, 
  onClick,
  className = '' 
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex cursor-default select-none items-center rounded-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground text-xs px-2 py-1 text-gray-600 ${className}`}
    >
      {children}
    </button>
  );
};