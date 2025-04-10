import React from 'react';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Card from '../Card/Card';
import { GridItem, CardActionHandler } from '../../../types';
import { WidgetOption } from '../../../config/widgets';
import Icons from '../../../assets/Icons/Icons';

interface MobileViewProps {
  gridItems: GridItem[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  widgetOptions: WidgetOption[];
  onAction: CardActionHandler;
  patientId: string | null;
  isAnyModalOpen: boolean;
  insuranceWritePermission: boolean;
}

/**
 * Mobile view with carousel for dashboard cards
 */
const MobileView: React.FC<MobileViewProps> = ({
  gridItems,
  activeCardIndex,
  setActiveCardIndex,
  nextCard,
  prevCard,
  widgetOptions,
  onAction,
  patientId,
  isAnyModalOpen,
  insuranceWritePermission
}) => {
  return (
    <div className="px-4 relative">
      {/* Only render navigation when we have items */}
      {gridItems.length > 0 && (
        <>
          {/* Navigation arrows positioned absolutely relative to the main container */}
          <button
            onClick={prevCard}
            className="z-[100] absolute left-0 top-2/5 -translate-y-1/2 flex items-center justify-center p-1 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
            aria-label="Previous card"
          >
            <Icons variant="carousel-prev" />
          </button>

          <button
            onClick={nextCard}
            className="z-[100] absolute right-0 top-2/5 -translate-y-1/2 flex items-center justify-center p-1 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
            aria-label="Next card"
          >
            <Icons variant="carousel-next" />
          </button>
        </>
      )}

      <SortableContext
        items={gridItems}
        strategy={rectSortingStrategy}
      >
        {gridItems.length > 0 &&
          gridItems.map((item, index) => {
            const widget = widgetOptions.find(
              (w) => w.key === item.id
            );
            if (!widget) return null;

            // Only show active card
            if (index !== activeCardIndex) return null;

            return (
              <Card
                key={widget.key}
                id={widget.key}
                title={widget.key}
                footer={true}
                category={widget.key}
                order={item.order}
                initialPosition={{ x: 0, y: 0 }}
                icon={widget.icon}
                onAction={onAction}
                patientId={patientId}
                iconBgColor={widget?.iconBgColor}
                hasWritePermission={
                  widget.key === "Insurance"
                    ? insuranceWritePermission
                    : widget.hasWritePermission
                }
                isAnyModalOpen={isAnyModalOpen}
              >
                {widget.component && (
                  <widget.component
                    patientId={patientId}
                    isAnyModalOpen={isAnyModalOpen}
                  />
                )}
              </Card>
            );
          })}
      </SortableContext>

      {/* Dots navigation at the bottom */}
      {gridItems.length > 1 && (
        <div className="flex justify-center mt-14 mb-4">
          {gridItems.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setActiveCardIndex(index)}
              className={`w-2 h-2 mx-3 rounded-full transition-colors ${
                index === activeCardIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileView;