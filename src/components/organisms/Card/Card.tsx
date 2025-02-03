import React, { useState, useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";

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
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false); // State for kebab menu
  const isResizing = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);

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
        setIsKebabMenuOpen(false); // Close kebab menu on Escape
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        kebabMenuRef.current &&
        !kebabMenuRef.current.contains(e.target as Node)
      ) {
        setIsKebabMenuOpen(false); // Close kebab menu if clicked outside
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleKebabMenu = () => {
    setIsKebabMenuOpen((prev) => !prev);
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-[80%] h-[80%] flex flex-col"
          >
            <div className="flex items-center justify-between pb-2 pr-10">
              <span className="font-semibold">{title}</span>
              <div className="flex items-center gap-4">
                <button>
                  <Icons variant="print" />
                </button>
                <button>
                  <Icons variant="share" />
                </button>
                <button>
                  <Icons variant="download" />
                </button>
                <button>
                  <Icons variant="delete" />
                </button>
                <button onClick={() => setIsModalOpen(false)}>
                  <Icons variant="close" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 p-4 overflow-y-auto">
              {/* Render the child content (AllergyTable) inside the modal */}
              {children}
            </div>
            {/* Render the footer inside the modal */}
            {footer && <div className="pt-2 border-t">{footer}</div>}
          </div>
        </div>
      )}
      {!isModalOpen && (
        <div
          className="absolute overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-lg"
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
          <div className="flex items-center justify-between p-4 bg-white cursor-move drag-handle">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCollapse}
                className="p-1 transition-colors rounded-md hover:bg-gray-100"
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
                className="p-1 transition-colors rounded-md hover:bg-gray-100"
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
                className="relative p-1 transition-colors rounded-md hover:bg-gray-100"
                type="button"
                onClick={toggleKebabMenu}
              >
                <Icons variant="kebab-menu" />
                {isKebabMenuOpen && (
                  <div
                    ref={kebabMenuRef}
                    className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                  >
                    <div className="py-1">
                      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        <Icons variant="download" />
                        Export
                      </button>
                      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        <Icons variant="print" />
                        Print
                      </button>
                      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        <Icons variant="share" />
                        Share
                      </button>
                      <button
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                        disabled
                      >
                        <Icons variant="delete" />
                        Cannot Delete Default Widget
                      </button>
                    </div>
                  </div>
                )}
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
                <div className="p-2 border-t">{footer}</div>
              )}
              <div
                className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
              />
              <div
                className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "left")}
              />
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
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
