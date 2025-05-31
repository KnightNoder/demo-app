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
      className={`flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-64 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};