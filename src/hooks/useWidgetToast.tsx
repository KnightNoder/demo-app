// src/hooks/useWidgetToast.tsx
import React from 'react'; // This import is crucial for JSX
import { toast, ToastOptions } from "react-toastify";

interface ToastContent {
  widgetKey: string;
  isAdding: boolean;
}

// Create a separate component for the toast content
const ToastContent: React.FC<ToastContent> = ({ widgetKey, isAdding }) => (
  <div className="p-2">
    <h3 className="text-lg font-bold">
      {isAdding ? "Widget Added" : "Widget Removed"}
    </h3>
    <p className="font-semibold">{widgetKey}</p>
    <p className="text-sm text-gray-600">
      {isAdding
        ? "The widget has been added to your dashboard. You can now view and interact with it."
        : "The widget has been removed from your dashboard."}
    </p>
  </div>
);

/**
 * Custom hook for displaying widget-related toast notifications
 * @returns Function to show toast notifications when widgets are added or removed
 */
const useWidgetToast = () => {
  /**
   * Display a toast notification when a widget is added or removed
   * @param widgetKey The name/key of the widget
   * @param isAdding Whether the widget is being added (true) or removed (false)
   */
  const showWidgetToast = (widgetKey: string, isAdding: boolean) => {
    toast(
      <ToastContent widgetKey={widgetKey} isAdding={isAdding} />,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "rounded-md shadow-lg bg-white",
      } as ToastOptions
    );
  };

  return { showWidgetToast };
};

export default useWidgetToast;