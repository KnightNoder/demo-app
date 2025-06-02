import React from 'react';

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  placeholder = "Search", 
  value, 
  onChange,
  className = ""
}) => {
  return (
    <input
      type="text"
      className={`flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-64 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};