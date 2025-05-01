import React from "react";
import Button from "../../atoms/Button/Button";
import Icons from "../../../assets/Icons/Icons";

interface CardFooterProps {
  category?: string | null | undefined;
  patientId?: string | null;
  onAction?: (action: "add" | "view", category: string | null) => void;
  hasWritePermission?: boolean;
  isStrictAuditor?: boolean;
}

const CardFooter: React.FC<CardFooterProps> = ({
  category,
  onAction,
  // hasWritePermission,
  isStrictAuditor,
}) => {
  const handleAddClick = () => {
    if (onAction) {
      // This will trigger the parent's handleAddAction which sets isFooterModalOpen
      onAction("add", category ?? null);

      // Dispatch a custom event to notify that a footer modal is open
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: true, modalType: "footer" },
      });
      document.dispatchEvent(modalOpenEvent);
    }
  };

  return (
    <div role="contentinfo" data-testid="card-content" className="w-full">
      <div className="footer h-14 bg-white/95 backdrop-blur rounded-b-lg">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
            {!isStrictAuditor && (
              <Button
                variant="primary"
                dataCy="data-primary"
                onClick={handleAddClick}
              >
                <Icons variant="add" />
                Add {category}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;