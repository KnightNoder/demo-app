import React, { useState, useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DraggableCard: React.FC<CardProps> = ({ title, children, footer }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState<null | string>(null); 
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
        setIsKebabMenuOpen(false); 
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

  const handleMouseEnterResizeHandle = (edge: string) => {
    setHoveredEdge(edge); // Track which edge is hovered
  };

  const handleMouseLeaveResizeHandle = () => {
    setHoveredEdge(null); // Reset when leaving the resize handle
  };

  const getResizeCursor = () => {
    switch (hoveredEdge) {
      case "top":
      case "bottom":
        return "ns-resize";
      case "left":
      case "right":
        return "ew-resize";
      case "top-left":
      case "bottom-right":
        return "nwse-resize";
      case "top-right":
      case "bottom-left":
        return "nesw-resize";
      default:
        return "default";
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-transparent bg-opacity-50 modal backdrop-blur-sm"
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
              {children}
            </div>
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
            cursor: isDragging ? "grabbing" : getResizeCursor(),
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between p-4 bg-white cursor-move header drag-handle">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCollapse}
                className="p-1 transition-colors rounded-md hover:bg-gray-100"
              >
                {isCollapsed ? (
                  <Icons variant="collapseUp" />
                ) : (
                    <Icons variant="collapseDown" />
                )}
              </button>
              <button
                onClick={handleExpandModal}
                className="p-1 transition-colors rounded-md hover:bg-gray-100"
              >
                <Icons variant="modalExpand" />
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
                onMouseEnter={() => handleMouseEnterResizeHandle("top")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "top")}
              />
              {children}
              {!isCollapsed && footer && (
                <div className="p-2 border-t">{footer}</div>
              )}
              <div
                className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("bottom")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
              />
              <div
                className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("left")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "left")}
              />
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("right")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "right")}
              />
              <div
                className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("top-left")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
              />
              <div
                className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("top-right")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
              />
              <div
                className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("bottom-left")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
              />
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("bottom-right")}
                onMouseLeave={handleMouseLeaveResizeHandle}
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
