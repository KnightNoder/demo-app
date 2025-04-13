import React, { useRef, useEffect } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Card from "../Card/Card";
import { GridItem, CardActionHandler } from "../../../types";
import { WidgetOption } from "../../../config/widgets";
import Icons from "../../../assets/Icons/Icons";

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
  // nextCard,
  // prevCard,
  widgetOptions,
  onAction,
  patientId,
  isAnyModalOpen,
  insuranceWritePermission,
}) => {
  // Reference to the thumbnail container
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  // Reference to the active thumbnail
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  // Scroll the active thumbnail to center when active index changes
  useEffect(() => {
    if (thumbnailContainerRef.current && activeThumbnailRef.current) {
      const container = thumbnailContainerRef.current;
      const activeThumb = activeThumbnailRef.current;

      // Calculate positions
      const containerWidth = container.offsetWidth;
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.offsetWidth;

      // Calculate the scroll position to center the active thumbnail
      const scrollLeft = thumbLeft - containerWidth / 2 + thumbWidth / 2;

      // Smooth scroll to the calculated position
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeCardIndex]);

  return (
    <div className="px-4 relative">
      {/* Only render navigation when we have items */}
      {gridItems.length > 0 && (
        <>
          {/* Navigation arrows positioned absolutely relative to the main container */}
          {/* <button
            onClick={prevCard}
            className="z-[100] absolute left-0 top-2/5 -translate-y-1/2 flex items-center justify-center p-1 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
            aria-label="Previous card"
          >
            <Icons variant="carousel-prev" />
          </button> */}

          {/* <button
            onClick={nextCard}
            className="z-[100] absolute right-0 top-2/5 -translate-y-1/2 flex items-center justify-center p-1 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
            aria-label="Next card"
          >
            <Icons variant="carousel-next" />
          </button> */}
        </>
      )}

      <SortableContext items={gridItems} strategy={rectSortingStrategy}>
        {gridItems.length > 0 &&
          gridItems.map((item, index) => {
            const widget = widgetOptions.find((w) => w.key === item.id);
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

      {/* Mini widget thumbnails for navigation - with auto-centering of active thumbnail */}
      {gridItems.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex items-center mt-14 mb-8 overflow-x-auto py-2 px-4 max-w-full scrollbar-hide"
        >
          {/* Give some space at the start to allow centering the first thumbnail */}
          <div className="min-w-[calc(50%-40px)]"></div>

          {/* Map through gridItems to maintain the same order */}
          {gridItems.map((item, index) => {
            const widget = widgetOptions.find((w) => w.key === item.id);
            if (!widget) return null;

            const isActive = index === activeCardIndex;

            return (
              <button
                key={`thumbnail-${index}`}
                ref={isActive ? activeThumbnailRef : null}
                onClick={() => setActiveCardIndex(index)}
                className={`flex flex-col items-center relative min-w-20 mx-2 transition-all ${
                  isActive
                    ? "transform scale-110 opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
                aria-label={`Go to ${widget.key} widget`}
                aria-pressed={isActive}
              >
                <div
                  className={`w-12 h-12 rounded-lg mb-1 flex items-center justify-center shadow-sm ${
                    isActive
                      ? "border-[.25px] border-[#0093D3]"
                      : "border border-gray-200"
                  }`}
                  style={{ backgroundColor: widget.iconBgColor || "#0093D3" }}
                >
                  {widget.icon && (
                    <div className="w-6 h-6 flex justify-center items-center">
                      <Icons variant={widget.icon} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-medium truncate max-w-20 ${
                    isActive ? "text-[#0093D3]" : "text-gray-600"
                  }`}
                >
                  {widget.key}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                )}
              </button>
            );
          })}

          {/* Give some space at the end to allow centering the last thumbnail */}
          <div className="min-w-[calc(50%-40px)]"></div>
        </div>
      )}
    </div>
  );
};

export default MobileView;
