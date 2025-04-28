// components/WidgetsButton.tsx
import { useEffect, forwardRef } from "react";
import Icons from "../../../assets/Icons/Icons";

interface WidgetsButtonProps {
  isWidgetMenuOpen: boolean;
  setIsWidgetMenuOpen: (isOpen: boolean) => void;
}

const WidgetsButton = forwardRef<HTMLDivElement, WidgetsButtonProps>(
  ({ isWidgetMenuOpen, setIsWidgetMenuOpen }, ref) => {
    useEffect(() => {
      // Ask for notification permission
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          console.log("Notification permission:", permission);
        });
      }
    }, []);

    return (
      <div className="flex-shrink-0" ref={ref}>
        <button
          id="widgets-toggle-button"
          aria-expanded={isWidgetMenuOpen}
          onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
          className="flex items-center p-2 space-x-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
        >
          <Icons variant="widgets" />
          <span className="font-light">Widgets</span>
        </button>
      </div>
    );
  }
);

// Add display name for debugging and React DevTools
WidgetsButton.displayName = "WidgetsButton";

export default WidgetsButton;