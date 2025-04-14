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
  console.log(isStrictAuditor, "in footer");

  const handleAddClick = () => {
    if (onAction) {
      onAction("add", category ?? null);
    }
  };

  const handleViewHistoryClick = () => {
    if (onAction) {
      onAction("view", category ?? null);
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

            <Button
              variant="secondary"
              dataCy="data-secondary"
              onClick={handleViewHistoryClick}
            >
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;