import React, { useState, useRef, useEffect } from 'react';
import Icons from '../../../assets/Icons/Icons';
import { WidgetOption } from '../../../config/widgets';

interface WidgetMenuProps {
  widgetOptions: WidgetOption[];
  visibleWidgets: string[];
  authorizedWidgets: string[]; // Add authorizedWidgets prop
  toggleWidget: (widgetKey: string) => void;
  isWidgetMenuOpen: boolean;
  setIsWidgetMenuOpen: (isOpen: boolean) => void;
  isMobileView: boolean;
  isAnyModalOpen: boolean;
}

/**
 * Widget selection menu component
 */
const WidgetMenu: React.FC<WidgetMenuProps> = ({
  widgetOptions,
  visibleWidgets,
  authorizedWidgets, // New prop for authorized widgets from ACL
  toggleWidget,
  isWidgetMenuOpen,
  setIsWidgetMenuOpen,
  isMobileView,
  isAnyModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
  const [comingSoonPosition, setComingSoonPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const comingSoonTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if a modal is currently open
      const modalIsOpen = document.querySelector(".modal");

      // Only close the widget menu if no modal is open
      if (
        !modalIsOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsWidgetMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWidgetMenuOpen(false);
        // Remove focus from any elements to prevent focus outline
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    if (isWidgetMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWidgetMenuOpen, setIsWidgetMenuOpen]);

  // Handle mouse enter for strip buttons to show Coming Soon popup
  const handleMouseEnter = (
    buttonName: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Get button position
    const rect = e.currentTarget.getBoundingClientRect();

    // Set position for the Coming Soon popup - position it closer to the button
    setComingSoonPosition({
      top: 45, // Just below the button
      left: rect.left + window.scrollX + rect.width / 2 - 85, // Center the popup below the button
    });

    // Set active button
    setActiveButton(buttonName);

    // Show Coming Soon popup
    setShowComingSoon(true);
  };

  // Handle mouse leave for strip buttons to hide Coming Soon popup
  const handleMouseLeave = () => {
    setShowComingSoon(false);
    setActiveButton(null);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (comingSoonTimeoutRef.current !== null) {
        window.clearTimeout(comingSoonTimeoutRef.current);
      }
    };
  }, []);

  // Filter widget options to only show authorized widgets
  const authorizedWidgetOptions = widgetOptions.filter((widget) =>
    authorizedWidgets.includes(widget.key)
  );

  return (
    <div
      className={`relative flex ${isMobileView ? "justify-center" : "justify-end"} mx-auto mb-24 transform mr-[36px] ${isAnyModalOpen ? "z-10" : "z-50"}`}
      ref={widgetRef}
    >
      {/* Widgets button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
          className="flex items-center p-2 space-x-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
        >
          <Icons variant="widgets" />
          <span className="font-light">Widgets</span>
        </button>
      </div>

      {/* Separate continuous strip for other buttons - hide on mobile */}
      <div
        className={`${isMobileView ? "hidden" : "ml-6"} bg-white border border-gray-200 rounded-md shadow-sm`}
      >
        <div className="flex flex-wrap">
          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "Client Info" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("Client Info", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>Client Info</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "Clinical" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("Clinical", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>Clinical</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "Documents" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("Documents", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>Documents</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "Reports" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("Reports", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>Reports</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "Other" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("Other", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>Other</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "EDI" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("EDI", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>EDI</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "External Links" ? "bg-gray-200" : ""}`}
            onMouseEnter={(e) => handleMouseEnter("External Links", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>External Links</span>
          </button>

          <button
            className={`flex items-center py-2 px-4 font-light ${activeButton === "More Options" ? "bg-gray-200" : "hover:bg-gray-50"}`}
            onMouseEnter={(e) => handleMouseEnter("More Options", e)}
            onMouseLeave={handleMouseLeave}
          >
            <span>More Options</span>
          </button>
        </div>
      </div>

      {/* Coming Soon popup */}
      {showComingSoon && (
        <div
          className="absolute flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 bg-white border-2 border-gray-200 rounded-md shadow-md p-3 z-50 transition-opacity duration-300"
          style={{
            top: `${comingSoonPosition.top}px`,
            left: `${comingSoonPosition.left}px`,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            minWidth: "170px",
            textAlign: "center",
          }}
        >
          <span className="font-light">Coming Soon...</span>
        </div>
      )}

      {/* Widget menu dropdown */}
      <div
        className={`absolute top-full ${isMobileView ? "" : "right-[380px]"} mt-2 p-4 bg-white rounded-md shadow-lg transition-transform duration-300 ${
          isWidgetMenuOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        } ${isMobileView ? "w-[300px] mx-auto left-0 right-0" : "w-[500px]"}`}
        style={{ zIndex: 1000 }}
      >
        {/* Search input */}
        <div className="relative flex items-center">
          <Icons variant="search" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search widgets..."
            className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50"
          />
        </div>

        {/* Widget grid - adapt to mobile with flex-col */}
        <div
          className={`${isMobileView ? "flex flex-col space-y-4" : "grid grid-cols-2 gap-4"} mt-4`}
        >
          {/* Add Widgets list - ONLY show authorized widgets */}
          <div>
            <h3 className="pb-1 mb-2 font-bold">Add Widgets</h3>
            <ul className="mt-4 overflow-auto max-h-60">
              {authorizedWidgetOptions
                .filter(
                  (w) =>
                    !visibleWidgets.includes(w.key) &&
                    w.key.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((widget) => (
                  <li
                    key={widget.key}
                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                  >
                    <span className="flex items-center space-x-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor}`}
                      >
                        <Icons variant={widget.icon} />
                      </div>
                      <span>{widget.key}</span>
                    </span>
                    <button
                      className="font-bold text-green-500"
                      onClick={() => toggleWidget(widget.key)}
                    >
                      +
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Remove Widgets list - only show authorized widgets */}
          <div>
            <h3 className="pb-1 mb-2 font-bold">Remove Widgets</h3>
            <ul className="overflow-auto max-h-60">
              {visibleWidgets
                .filter((key) =>
                  key.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((key) => {
                  const widget = widgetOptions.find((w) => w.key === key);
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <span className="flex items-center space-x-2">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor || ""}`}
                        >
                          <Icons variant={widget?.icon || "default"} />
                        </div>
                        <span>{key}</span>
                      </span>
                      <button
                        className="font-bold text-red-500"
                        onClick={() => toggleWidget(key)}
                      >
                        -
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetMenu;