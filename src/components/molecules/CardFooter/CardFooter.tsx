import React from "react";
import Button from "../../atoms/Button/Button";
import Icons from "../../../assets/Icons/Icons";
import { CustomScroll } from "react-custom-scroll";

interface CardFooterProps {
  category?: string | null | undefined;
  patientId?: string | null;
  onAction?: (action: "add" | "view", category: string | null) => void;
}

const CardFooter: React.FC<CardFooterProps> = ({ category, onAction }) => {
  const handleAddClick = () => {
    console.log("clicked", onAction);
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
    <div
      role="contentinfo"
      data-testid="card-content"
      className="absolute bottom-0 left-0 w-full"
    >
      <CustomScroll heightRelativeToParent="calc(100% - 100px)">
        <div className="footer h-14 bg-white/95 backdrop-blur">
          <div className="relative h-full">
            <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
              <Button
                variant="primary"
                dataCy="data-primary"
                onClick={handleAddClick}
              >
                <Icons variant="add" />
                Add {category}
              </Button>

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
      </CustomScroll>
    </div>
  );
};

export default CardFooter;
