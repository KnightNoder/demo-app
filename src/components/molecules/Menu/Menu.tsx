import React from "react";
import Button from "../../atoms/Button/Button"; // Adjust import path accordingly
import Icon from "../../../assets/Icons/Icons";

// Defining the MenuOption type with allowed icon values
export type MenuIconVariant = "download" | "print" | "share" | "delete";

export interface MenuOption {
  label: string;
  icon: MenuIconVariant;
  onClick: () => void;
  disabled: boolean;
}

interface MenuProps {
  isOpen: boolean;
  onToggle: () => void;
  options?: MenuOption[];
}

const Menu: React.FC<MenuProps> = ({ isOpen, onToggle, options }) => {
  return (
    <div className="relative">
      <Button variant="default" data-cy="default-button" onClick={onToggle}>
        <Icon variant="kebab-menu" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {options && options.map((option) => (
              <Button
                key={option.label}
                variant="default" data-cy="default-button"
                onClick={option.onClick}
                dataCy={`menu-option-${option.label.toLowerCase().replace(" ", "-")}`}
                disabled={option.disabled}
              >
                <Icon variant={option.icon} />
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
