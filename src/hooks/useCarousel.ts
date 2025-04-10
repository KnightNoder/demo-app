import { useState, useEffect } from 'react';
import { GridItem } from '../types';

/**
 * Custom hook to handle carousel functionality for mobile view
 */
export const useCarousel = (gridItems: GridItem[], isMobileView: boolean) => {
  // State for current carousel card index (for mobile view)
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Reset active card index when switching between mobile and desktop view
  useEffect(() => {
    if (isMobileView && activeCardIndex >= gridItems.length) {
      setActiveCardIndex(0);
    }
  }, [isMobileView, gridItems.length, activeCardIndex]);

  // Move to the next card in the carousel
  const nextCard = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === gridItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Move to the previous card in the carousel
  const prevCard = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === 0 ? gridItems.length - 1 : prevIndex - 1
    );
  };

  return {
    activeCardIndex,
    setActiveCardIndex,
    nextCard,
    prevCard
  };
};