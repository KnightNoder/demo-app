import React from "react";
import Button from "../../atoms/Button/Button";
import Icon from "../../../assets/Icons/Icons";
import Menu from "../../molecules/Menu/Menu";

type MenuIconVariant = "download" | "print" | "share" | "delete";

interface MenuOption {
  label: string;
  icon: MenuIconVariant;
  onClick: () => void;
  disabled: boolean;
}

interface CardHeaderProps {
  title: string;
  isCollapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  onKebabMenuToggle: () => void;
  isKebabMenuOpen: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  isCollapsed,
  onCollapse,
  onExpand,
  onKebabMenuToggle,
  isKebabMenuOpen,
}) => {
  const menuOptions: MenuOption[] = [
    { label: "Export", icon: "download", onClick: () => { }, disabled: false },
    { label: "Print", icon: "print", onClick: () => { }, disabled: false },
    { label: "Share", icon: "share", onClick: () => { }, disabled: false },
    { label: "Cannot Delete Default Widget", icon: "delete", onClick: () => { }, disabled: true },
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-white cursor-move header drag-handle">
      <h3 className="font-medium">{title}</h3>
      <div className="flex items-center gap-1">
        <Button variant="default" onClick={onCollapse}>
          <Icon variant={isCollapsed ? "collapseUp" : "collapseDown"} />
        </Button>
        <Button variant="default" onClick={onExpand}>
          <Icon variant="modalExpand" />
        </Button>
        <Menu isOpen={isKebabMenuOpen} onToggle={onKebabMenuToggle} options={menuOptions} />
      </div>
    </div>
  );
};

export default CardHeader;