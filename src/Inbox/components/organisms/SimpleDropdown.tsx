import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { DropdownButton } from '../molecules/DropdownButton';
import { DropdownMenu } from '../molecules/DropdownMenu';
import { DropdownItem } from '../molecules/DropdownItem';

interface SimpleDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (disabled) return;
    onChange(option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <FormField label={label} required={required}>
      <div className="relative">
        <DropdownButton
          isOpen={isOpen}
          onClick={handleToggle}
          placeholder={placeholder}
          disabled={disabled}
        >
          {value}
        </DropdownButton>
        <DropdownMenu isOpen={isOpen && !disabled}>
          {options.map((option) => (
            <DropdownItem key={option} onClick={() => handleSelect(option)}>
              <span className="text-sm">{option}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </div>
    </FormField>
  );
};