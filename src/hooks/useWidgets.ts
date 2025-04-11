// src/hooks/useWidgets.tsx
import { useState, useEffect } from 'react';
import useWidgetToast from './useWidgetToast';

// Define the interface for grid items
interface GridItem {
  id: string;
  order: number;
}

export const useWidgets = () => {
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>([
    "Vitals",
    "Lab Reports",
    "Allergies",
    "Disclosures",
    "Demographics",
    "Notifications",
    "Advanced Directives",
    "Appointments",
    "Clinical Notes",
  ]);

  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const { showWidgetToast } = useWidgetToast();

  // Initialize grid items from visible widgets
  useEffect(() => {
    const items = visibleWidgets.map((widgetKey, index) => ({
      id: widgetKey,
      order: index,
    }));
    setGridItems(items);
  }, [visibleWidgets]);

  const toggleWidget = (widgetKey: string) => {
    setVisibleWidgets((prevWidgets) => {
      const isAdding = !prevWidgets.includes(widgetKey);
      
      // Use the toast hook to show notifications
      showWidgetToast(widgetKey, isAdding);

      if (isAdding) {
        // Add the widget to the grid items with the next order number
        const newOrder = gridItems.length;
        setGridItems((prev) => [...prev, { id: widgetKey, order: newOrder }]);
        return [...prevWidgets, widgetKey];
      } else {
        // Remove the widget from grid items
        setGridItems((prev) => prev.filter((item) => item.id !== widgetKey));
        // Reorder remaining items
        setGridItems((prev) =>
          prev.map((item, index) => ({ ...item, order: index }))
        );
        return prevWidgets.filter((w) => w !== widgetKey);
      }
    });
  };

  return {
    visibleWidgets,
    setVisibleWidgets,
    gridItems,
    setGridItems,
    toggleWidget
  };
};