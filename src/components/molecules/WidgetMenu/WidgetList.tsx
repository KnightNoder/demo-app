// components/WidgetList.tsx
import React from 'react';
import Icons from '../../../assets/Icons/Icons';
import { WidgetOption } from '../../../config/widgets';

interface WidgetListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  authorizedWidgetOptions: WidgetOption[];
  visibleWidgets: string[];
  toggleWidget: (widgetKey: string) => void;
  widgetOptions: WidgetOption[];
  isMobileView: boolean;
  isSmallScreen: boolean;
  setIsExpandAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const WidgetList: React.FC<WidgetListProps> = ({
  searchTerm,
  setSearchTerm,
  authorizedWidgetOptions,
  visibleWidgets,
  toggleWidget,
  widgetOptions,
  isMobileView,
  isSmallScreen,
  // setIsExpandAll,
}) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Search input */}
      <div className="relative flex items-center w-full">
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
        className={`${isMobileView || isSmallScreen ? "flex flex-col space-y-4" : "grid grid-cols-2 gap-4"} mt-4 w-full`}
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
                  className="flex items-center cursor-pointer justify-between p-2 rounded-md hover:bg-gray-100"
                  onClick={() => toggleWidget(widget.key)}
                >
                  <span className="flex items-center space-x-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor}`}
                    >
                      <Icons variant={widget.icon} />
                    </div>
                    <span>{widget.key}</span>
                  </span>
                  <button className="font-bold  text-green-500">+</button>
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
                    className="flex items-center cursor-pointer justify-between p-2 rounded-md  hover:bg-gray-100"
                    onClick={() => toggleWidget(key)}
                  >
                    <span className="flex items-center space-x-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor || ""}`}
                      >
                        <Icons variant={widget?.icon || "default"} />
                      </div>
                      <span>{key}</span>
                    </span>
                    <button className="font-bold text-red-500">-</button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WidgetList;