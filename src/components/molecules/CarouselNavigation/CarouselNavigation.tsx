import React from 'react';
import Icons from '../../../assets/Icons/Icons';
import { GridItem } from '../../../types';

interface CarouselNavigationProps {
  prevCard: () => void;
  nextCard: () => void;
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  gridItems: GridItem[];
}

/**
 * Carousel navigation component for mobile view
 */
const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  prevCard,
  nextCard,
  activeCardIndex,
  setActiveCardIndex,
  gridItems
}) => {
  return (
    <>
      {/* Navigation arrows */}
      <div className="relative">
        <button
          onClick={prevCard}
          className="z-[999] absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
          aria-label="Previous card"
        >
          <Icons variant="carousel-prev" />
        </button>

        <button
          onClick={nextCard}
          className="z-[999] absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition-colors"
          aria-label="Next card"
        >
          <Icons variant="carousel-next" />
        </button>
      </div>

      {/* Dots navigation */}
      {gridItems.length > 1 && (
        <div className="flex justify-center mt-14 mb-4">
          {gridItems.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setActiveCardIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full transition-colors ${
                index === activeCardIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CarouselNavigation;