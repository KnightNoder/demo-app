import { useState, useEffect, useCallback } from "react";

interface UseScrollDetectionReturn {
  scrollableContainers: Set<string>;
  checkScrollable: (containerId: string) => void;
}

export const useScrollDetection = (
  dependencies: any[]
): UseScrollDetectionReturn => {
  const [scrollableContainers, setScrollableContainers] = useState<Set<string>>(
    new Set()
  );

  // Function to check if container is scrollable
  const checkScrollable = useCallback((containerId: string) => {
    const container = document.querySelector(
      `[data-swim-lane="${containerId}"] .overflow-x-auto`
    );
    if (container) {
      const isScrollable = container.scrollWidth > container.clientWidth;
      console.log(
        `Lane ${containerId}: scrollWidth=${container.scrollWidth}, clientWidth=${container.clientWidth}, isScrollable=${isScrollable}`
      );
      setScrollableContainers((prev) => {
        const newSet = new Set(prev);
        if (isScrollable) {
          newSet.add(containerId);
        } else {
          newSet.delete(containerId);
        }
        return newSet;
      });
    }
  }, []);

  // Check all containers when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Checking scrollability for all lanes...");
      // This would need the swimLanes data passed from parent
      // For now, we'll expose the checkScrollable function
    }, 200);

    return () => clearTimeout(timer);
  }, dependencies);

  // Add resize observer to check scrollability when window resizes
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized, rechecking scrollability...");
      setTimeout(() => {
        // This would need to be called with actual lane data from parent
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    scrollableContainers,
    checkScrollable,
  };
};