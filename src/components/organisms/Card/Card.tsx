import React, { useState, useRef, useEffect } from "react";
import AllergyTable from "../AllergiesCard/AllergiesCard";

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // Add footer prop
}

const DraggableCard: React.FC<CardProps> = ({ title, children, footer }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isResizing = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing.current) return;
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "grabbing";

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - startX, y: e.clientY - startY });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    direction:
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch (direction) {
        case "top":
          newHeight = Math.max(100, startHeight - deltaY);
          newTop = startTop + deltaY;
          break;
        case "bottom":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "left":
          newWidth = Math.max(100, startWidth - deltaX);
          newLeft = startLeft + deltaX;
          break;
        case "right":
          newWidth = Math.max(100, startWidth + deltaX);
          break;
        case "top-left":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          newLeft = startLeft + deltaX;
          newTop = startTop + deltaY;
          break;
        case "top-right":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          newTop = startTop + deltaY;
          break;
        case "bottom-left":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          newLeft = startLeft + deltaX;
          break;
        case "bottom-right":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      isResizing.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleExpandModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-2xl"
          >
            <div className="flex justify-between items-center  pb-2">
              <span className="font-semibold">{title}</span>
              <button onClick={() => setIsModalOpen(false)}>❌</button>
            </div>
            <div className="p-4 relative">
              {/* Render the child content (AllergyTable) inside the modal */}
              {children}
            </div>
            {/* Render the footer inside the modal */}
            {footer && <div className="border-t pt-2">{footer}</div>}
          </div>
        </div>
      )}
      {!isModalOpen && (
        <div
          className="absolute overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            width: `${size.width}px`,
            height: isCollapsed ? "auto" : `${size.height}px`,
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? "grabbing" : "default",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="drag-handle flex items-center justify-between p-4 cursor-move bg-white">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCollapse}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                {isCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 15.75 7.5-7.5 7.5 7.5"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={handleExpandModal}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {!isCollapsed && (
            <>
              <div
                className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "top")}
              />
              {children}
              {!isCollapsed && footer && (
                <div className="border-t p-2">{footer}</div>
              )}
              <div
                className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
              />
              <div
                className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "left")}
              />
              <div
                className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "right")}
              />
              <div
                className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
              />
              <div
                className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
              />
              <div
                className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
              />
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default DraggableCard;
