import { useState, useEffect } from 'react';

/**
 * Custom hook to handle responsive behavior
 */
export const useResponsive = () => {
  // State for window width to determine mobile view
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  // Mobile view check
  const isMobileView = windowWidth < 808;

  // Add event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Initial call
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate grid template columns based on window width
  const getGridTemplateColumns = () => {
    if (window.innerWidth >= 2375) {
      return "repeat(5, calc(20%))"; // 2xl breakpoint - 5 cards
    } else if (window.innerWidth >= 1855) {
      return "repeat(4, calc(25%))"; // xl breakpoint
    } else if (window.innerWidth >= 1455) {
      return "repeat(3, calc(33.33%))"; // lg breakpoint
    } else if (window.innerWidth >= 943) {
      return "repeat(2, calc(50%))"; // md breakpoint
    } else {
      return "100%"; // sm breakpoint
    }
  };

  return {
    windowWidth,
    isMobileView,
    getGridTemplateColumns
  };
};