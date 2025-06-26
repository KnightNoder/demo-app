import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  optional = false,
  htmlFor,
  className = ''
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-gray-400 ml-1">(optional)</span>}
    </label>
  );
};