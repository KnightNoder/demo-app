import React, { useState, useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";
import Header from "../../molecules/CardHeader/CardHeader";
import CardFooter from "../../molecules/CardFooter/CardFooter";

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  initialPosition: { x: number, y: number }
  category?: string | null
}

const DraggableCard: React.FC<CardProps> = ({ title, children, footer, initialPosition, category }) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState<null | string>(null); 
  // const [isVisible, setIsVisible] = useState(false);
  const isResizing = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.1);
  //       });
  //     },
  //     { threshold: 0.1 } // Move this outside the callback
  //   );

  //   if (cardRef.current) {
  //     observer.observe(cardRef.current);
  //   }

  //   return (() => {
  //     if (cardRef.current) {
  //       observer.unobserve(cardRef.current);
  //     }
  //   })

  // }, [])

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
        setIsKebabMenuOpen(false);
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

    const startX = e.clientX - position?.x;
    const startY = e.clientY - position?.y;

    const handleMouseMove = (e: MouseEvent) => {
      // const container = document.getElementById('card-container');
      // if (!container) return;

      // const containerRect = container.getBoundingClientRect();
      // const cardRect = cardRef.current?.getBoundingClientRect();

      // if (!cardRect) return;

      // // Calculate new position
      // let newX = e.clientX - startX;
      // let newY = e.clientY - startY;

      // // Constrain to container bounds
      // newX = Math.max(0, Math.min(newX, containerRect.width - cardRect.width));
      // newY = Math.max(0, Math.min(newY, containerRect.height - cardRect.height));

      // setPosition({ x: newX, y: newY });
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
    const startLeft = position?.x;
    const startTop = position?.y;

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
    console.log('in close modal');
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
      // setIsVisible(true);
    }
  };

  const toggleKebabMenu = () => {
    setIsKebabMenuOpen((prev) => !prev);
  };

  const handleMouseEnterResizeHandle = (edge: string) => {
    setHoveredEdge(edge);
  };

  const handleMouseLeaveResizeHandle = () => {
    setHoveredEdge(null);
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
          ref={cardRef}
          className="absolute z-10 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
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
          <div className="flex flex-col h-full">
            <Header
              title={title}
              isCollapsed={isCollapsed}
              handleCollapse={handleCollapse}
              handleExpandModal={handleExpandModal}
              isKebabMenuOpen={isKebabMenuOpen}
              toggleKebabMenu={toggleKebabMenu}
              kebabMenuRef={kebabMenuRef}
            />
            {!isCollapsed && (
              <div className="flex flex-col h-[calc(100%-8rem)]">
                <div className="flex-1 overflow-y-auto">
                  {true ? children : <div className="w-full h-full bg-gray-100 animate-pulse" />}
                </div>
                {footer && <div className="">{true ? <CardFooter category={category} /> : <div className="h-8 bg-gray-100 animate-pulse" />}</div>}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div
                className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
                onMouseEnter={() => handleMouseEnterResizeHandle("top")}
                onMouseLeave={handleMouseLeaveResizeHandle}
                onMouseDown={(e) => handleResizeMouseDown(e, "top")}
              />
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