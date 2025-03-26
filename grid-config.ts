// grid-config.ts
// This file contains grid-related utilities and configuration

// Grid size in pixels - adjust this to change the grid density
export const GRID_SIZE = 20;

/**
 * Snaps a value to the nearest grid point
 * @param value The value to snap
 * @returns The snapped value
 */
export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

/**
 * Snaps a position object to the grid
 * @param position The position object with x and y coordinates
 * @returns A new position object with snapped coordinates
 */
export const snapPositionToGrid = (position: { x: number, y: number }): { x: number, y: number } => {
  return {
    x: snapToGrid(position.x),
    y: snapToGrid(position.y)
  };
};

/**
 * Snaps a size object to the grid
 * @param size The size object with width and height
 * @param minSize Minimum size (defaults to GRID_SIZE)
 * @returns A new size object with snapped dimensions
 */
export const snapSizeToGrid = (
  size: { width: number, height: number }, 
  minSize: number = GRID_SIZE
): { width: number, height: number } => {
  return {
    width: Math.max(snapToGrid(size.width), minSize),
    height: Math.max(snapToGrid(size.height), minSize)
  };
};

/**
 * Renders a grid overlay for debugging or visual aid
 * @param visible Whether the grid should be visible
 * @returns JSX for the grid overlay
 */
export const GridOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="fixed inset-0 z-10 pointer-events-none" 
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
      }}
    ></div>
  );
};