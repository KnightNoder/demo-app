import React, { useRef, useState } from "react";
import { LeftIcon, RightIcon } from "../../components/assets/Icons";

// Task card configuration interface
export interface TaskCardConfig {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  variant: "urgent" | "normal";
  priority: "high" | "medium" | "low" | "other";
  testId: string;
}

// Swim lane configuration interface
export interface SwimLaneConfig {
  priority: string;
  title: string;
  color: string;
  dotColor: string;
  textColor: string;
  cards: TaskCardConfig[];
}

// Props interface for PrioritySwimLanes component
interface PrioritySwimLanesProps {
  swimLanes: SwimLaneConfig[];
  onCardClick: (cardTitle: string, cardConfig?: TaskCardConfig) => void;
  scrollableContainers: Set<string>;
}

const PrioritySwimLanes: React.FC<PrioritySwimLanesProps> = ({
  swimLanes,
  onCardClick,
  scrollableContainers,
}) => {
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle touch start for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(false);
  };

  // Handle touch move for mobile swipe
  const handleTouchMove = (e: React.TouchEvent, laneKey: string) => {
    if (touchStartX === null) return;

    const touchX = e.touches[0].clientX;
    const diffX = touchStartX - touchX;

    // If significant movement, mark as dragging to prevent card clicks
    if (Math.abs(diffX) > 10) {
      setIsDragging(true);
    }

    // Scroll the container
    const container = scrollContainerRefs.current[laneKey];
    if (container && Math.abs(diffX) > 5) {
      container.scrollLeft += diffX * 0.5; // Damping factor for smoother scroll
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setTouchStartX(null);
    // Reset dragging state after a short delay to allow click events
    setTimeout(() => setIsDragging(false), 100);
  };

  // Get responsive scroll distance based on screen size
  const getScrollDistance = () => {
    if (window.innerWidth < 640) return 160; // Mobile: card width + gap
    if (window.innerWidth < 768) return 180; // Tablet: smaller cards
    return 220; // Desktop: full card width + gap
  };

  const handleScrollLeft = (e: React.MouseEvent, containerSelector: string) => {
    e.stopPropagation();
    const container = scrollContainerRefs.current[containerSelector];
    if (container) {
      container.scrollBy({
        left: -getScrollDistance(),
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = (
    e: React.MouseEvent,
    containerSelector: string
  ) => {
    e.stopPropagation();
    const container = scrollContainerRefs.current[containerSelector];
    if (container) {
      container.scrollBy({
        left: getScrollDistance(),
        behavior: "smooth",
      });
    }
  };

  // Handle card click with drag prevention
  const handleCardClick = (
    cardTitle: string,
    cardConfig: TaskCardConfig,
    e: React.MouseEvent
  ) => {
    // Prevent click if user was dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onCardClick(cardTitle, cardConfig);
  };

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {swimLanes.map((lane) => {
        const isScrollable = scrollableContainers.has(lane.priority);

        return (
          <div
            key={lane.priority}
            data-swim-lane={lane.priority}
            className="px-2 sm:px-4"
          >
            {/* Lane Header */}
            <div className="mb-2 md:mb-3">
              <h3
                className={`text-sm sm:text-base lg:text-lg font-medium ${lane.textColor} flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${lane.dotColor}`}
                  ></div>
                  <span>{lane.title}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 ml-3.5 sm:ml-0">
                  ({lane.cards.length} items)
                </span>
              </h3>
            </div>

            {/* Cards Container */}
            <div className="relative group">
              {/* Scrollable Cards Container */}
              <div
                ref={(el) => {
                  scrollContainerRefs.current[lane.priority] = el;
                }}
                className="overflow-x-auto scrollbar-hide relative touch-pan-x"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, lane.priority)}
                onTouchEnd={handleTouchEnd}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* Cards Grid/Flex Layout */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 pb-2 md:pb-4 pt-1">
                  {lane.cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex-shrink-0 w-36 xs:w-40 sm:w-44 md:w-52 lg:w-56"
                    >
                      <div
                        className="relative rounded-lg sm:rounded-xl border-2 border-white ring-1 sm:ring-2 ring-inset ring-white/80 bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50 hover:scale-[1.02] sm:hover:scale-[1.03] hover:border-blue-200 hover:z-10 transition-all duration-200 cursor-pointer group/card p-2.5 sm:p-3 h-full flex flex-col active:scale-[0.98] touch-manipulation"
                        tabIndex={0}
                        aria-label={card.title}
                        data-testid={card.testId}
                        onClick={(e) => handleCardClick(card.title, card, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onCardClick(card.title, card);
                          }
                        }}
                      >
                        {/* Card Background Overlay */}
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/70 pointer-events-none z-0 group-hover/card:bg-white/80 transition-colors duration-200"></div>

                        {/* Card Header */}
                        <div className="flex items-start gap-2 z-10 relative">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="text-gray-500 text-sm sm:text-base">
                              {card.icon}
                            </div>
                          </div>
                          <span className="text-gray-800 font-medium text-xs sm:text-sm lg:text-base text-left line-clamp-2 leading-tight">
                            {card.title}
                          </span>
                        </div>

                        {/* Card Count */}
                        <div className="mt-2 sm:mt-3 flex justify-between items-end z-10 relative">
                          <div>
                            <span
                              className={`text-xl sm:text-2xl lg:text-3xl font-${card.variant === "urgent" ? "bold" : "normal"} ${
                                card.variant === "urgent"
                                  ? "text-red-600"
                                  : lane.priority === "high"
                                    ? "text-orange-600"
                                    : "text-gray-600"
                              } leading-none`}
                            >
                              {card.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Carousel Navigation - Only show if scrollable */}
              {/* Carousel Navigation - Show for all screen sizes when scrollable */}
              {isScrollable && (
                <>
                  {/* Fade gradients - Desktop only */}
                  <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-12 xl:w-16 bg-gradient-to-r from-[#f4f5fb] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                  <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-12 xl:w-16 bg-gradient-to-l from-[#f4f5fb] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

                  {/* Left arrow - All screen sizes */}
                  <button
                    className="flex absolute left-1 sm:left-2 xl:left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-600 opacity-60 lg:opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => handleScrollLeft(e, lane.priority)}
                    aria-label={`Scroll ${lane.title} left`}
                  >
                    <LeftIcon />
                  </button>

                  {/* Right arrow - All screen sizes */}
                  <button
                    className="flex absolute right-1 sm:right-2 xl:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-600 opacity-60 lg:opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => handleScrollRight(e, lane.priority)}
                    aria-label={`Scroll ${lane.title} right`}
                  >
                    <RightIcon />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrioritySwimLanes;
