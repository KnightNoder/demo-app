import React, { useRef, useEffect, useState, CSSProperties } from "react";
import TabButton from "../../atoms/TabButton/TabButton";

interface Tab {
  key?: string;
  label: string;
  count?: number;
}

interface TabListHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (label: string) => void;
}

const TabListHeader: React.FC<TabListHeaderProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Check if tabs are overflowing and update indicators
  const checkForOverflowAndIndicators = () => {
    if (scrollContainerRef.current && tabsContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const tabsContainer = tabsContainerRef.current;

      // Check if content is wider than container
      const isContentOverflowing =
        tabsContainer.scrollWidth > scrollContainer.clientWidth;
      setIsOverflowing(isContentOverflowing);

      if (isContentOverflowing) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

        // Show left indicator if scrolled to the right
        setShowLeftIndicator(scrollLeft > 8);

        // Show right indicator if there's more content to the right
        setShowRightIndicator(scrollLeft + clientWidth < scrollWidth - 8);
      } else {
        // No overflow, no indicators
        setShowLeftIndicator(false);
        setShowRightIndicator(false);
      }
    }
  };

  // Set up overflow detection and scroll event listeners
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      // Initial check
      checkForOverflowAndIndicators();

      // Check on scroll
      scrollContainer.addEventListener("scroll", checkForOverflowAndIndicators);

      // Check on resize
      window.addEventListener("resize", checkForOverflowAndIndicators);

      return () => {
        scrollContainer.removeEventListener(
          "scroll",
          checkForOverflowAndIndicators
        );
        window.removeEventListener("resize", checkForOverflowAndIndicators);
      };
    }
  }, [tabs]);

  // Get grid template columns based on number of tabs
  const getGridTemplateColumns = () => {
    const count = Math.min(tabs.length, 5);
    return `repeat(${count}, 1fr)`;
  };

  // Scroll left/right handler functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  // CSS for hiding scrollbar - using proper TypeScript types
  const noScrollbarStyles: CSSProperties = {
    WebkitOverflowScrolling: "touch",
  };

  // Add a style element to the document if it doesn't exist yet
  useEffect(() => {
    const styleId = "tablist-no-scrollbar-style";

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Optional cleanup
      const style = document.getElementById(styleId);
      if (style && !document.querySelector(".no-scrollbar")) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div
      role="tablist"
      className="top-0 z-10 flex items-center justify-start w-full bg-gray-100 rounded-sm h-9 relative"
      style={{ position: "sticky", top: 0 }}
    >
      {/* Left scroll indicator - only shown when needed */}
      {showLeftIndicator && (
        <div
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-6 bg-gradient-to-r from-gray-100 to-transparent cursor-pointer"
          onClick={scrollLeft}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm opacity-60">
            <span className="text-gray-600">&lsaquo;</span>
          </div>
        </div>
      )}

      {/* Tab container with hidden scrollbar */}
      <div
        ref={scrollContainerRef}
        className="flex items-center w-full overflow-x-auto no-scrollbar"
        style={noScrollbarStyles}
      >
        <div
          ref={tabsContainerRef}
          className={`flex items-center gap-2 px-1 pl-2 ${!isOverflowing ? "w-full" : "min-w-max"}`}
        >
          {!isOverflowing && tabs.length <= 5 ? (
            // For few tabs, use a grid to distribute them evenly
            <div
              className="w-full grid gap-2"
              style={{ gridTemplateColumns: getGridTemplateColumns() }}
            >
              {tabs?.map((tab, index) => (
                <div key={tab.key || `tab-container-${tab.label}-${index}`}>
                  <TabButton
                    key={tab.key || `tab-${tab.label}-${index}`}
                    label={tab.label}
                    activeTab={activeTab}
                    onClick={onTabClick}
                    count={tab.count}
                  />
                </div>
              ))}
            </div>
          ) : (
            // For many tabs, just display them normally
            tabs?.map((tab, index) => (
              <TabButton
                key={tab.key || `tab-${tab.label}-${index}`}
                label={tab.label}
                activeTab={activeTab}
                onClick={onTabClick}
                count={tab.count}
              />
            ))
          )}
        </div>
      </div>

      {/* Right scroll indicator - only shown when needed */}
      {showRightIndicator && (
        <div
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-6 bg-gradient-to-l from-gray-100 to-transparent cursor-pointer"
          onClick={scrollRight}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm opacity-60">
            <span className="text-gray-600">&rsaquo;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabListHeader;
