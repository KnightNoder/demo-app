import React, { useState, useRef, useEffect } from 'react';
import Icons from '../../../assets/Icons/Icons';
import { WidgetOption } from '../../../config/widgets';

interface WidgetMenuProps {
  widgetOptions: WidgetOption[];
  visibleWidgets: string[];
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
  toggleWidget,
  isWidgetMenuOpen,
  setIsWidgetMenuOpen,
  isMobileView,
  isAnyModalOpen
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

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

    if (isWidgetMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWidgetMenuOpen, setIsWidgetMenuOpen]);

  return (
    <div
      className={`relative flex ${isMobileView ? "justify-center" : "justify-end"} mx-auto mb-4 transform mr-[36px] ${isAnyModalOpen ? "z-10" : "z-50"}`}
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
          <button className="flex items-center py-2 px-4 font-light">
            <span>Client Info</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light">
            <span>Clinical</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light ">
            <span>Documents</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light ">
            <span>Reports</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light ">
            <span>Other</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light ">
            <span>EDI</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light ">
            <span>External Links</span>
          </button>

          <button className="flex items-center py-2 px-4 font-light hover:bg-gray-50">
            <span>More Options</span>
          </button>
        </div>
      </div>

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
          {/* Add Widgets list */}
          <div>
            <h3 className="pb-1 mb-2 font-bold">Add Widgets</h3>
            <ul className="mt-4 overflow-auto max-h-60">
              {widgetOptions
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

          {/* Remove Widgets list */}
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
                          className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor}`}
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