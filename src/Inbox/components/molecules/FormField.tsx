import React from 'react';
import { Label } from '../atoms/Label';

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  optional = false,
  children,
  className = '',
  id
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label required={required} optional={optional} htmlFor={id}>
        {label}
      </Label>
      {children}
    </div>
  );
};