// CardFooter.tsx
import React from "react";
import Button from "../../atoms/Button/Button";
import Icons from "../../../assets/Icons/Icons";

interface CardFooterProps {
  category?: string | null
}

const CardFooter: React.FC<CardFooterProps> = ({ category }) => {
  return (
    <div role="contentinfo" className="footer absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="relative h-full">
        <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
          <Button variant="primary" dataCy="data-primary" >
            <Icons variant="add" />
            Add {category}
          </Button>
          <Button variant="secondary" dataCy="data-secondary">
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;
