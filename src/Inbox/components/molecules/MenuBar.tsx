interface MenuBarProps {
  children: React.ReactNode;
  className?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ children, className = '' }) => {
  return (
    <div 
      role="menubar"
      className={`flex h-10 items-center space-x-1 p-1 bg-white border border-gray-200 rounded-md shadow-none px-4 mx-2 ${className}`}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {children}
    </div>
  );
};