import React, { useState, useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";
import Header from "../../molecules/CardHeader/CardHeader";
import CardFooter from "../../molecules/CardFooter/CardFooter";
import { CustomScroll } from "react-custom-scroll";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Define grid size for snapping
const GRID_SIZE = 20; // Size in pixels for the grid

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode | boolean;
  initialPosition: { x: number; y: number };
  category?: string | null;
  patientId?: string | null;
  icon?: string | undefined;
  onAction?: (action: "add" | "view", category: string | null) => void;
  id: string; // Required for dnd-kit
  order?: number; // Order in the grid for sorting
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  initialPosition,
  category,
  patientId,
  icon,
  onAction,
  id,
  order,
}) => {
  const [size, setSize] = useState({ width: "100%", height: 500 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState<null | string>(null);
  const isResizing = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Set up dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "card",
      order: order,
    },
  });

  // Apply the transform as CSS
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Keep the card appearance the same when dragging
    zIndex: isDragging ? 110 : 100,
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

    // Show grid on resize start
    document.body.classList.add("dragging-active");

    const startX = e.clientX;
    const startY = e.clientY;
    const startHeight = typeof size.height === "number" ? size.height : 500;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      let newHeight = startHeight;

      switch (direction) {
        case "top":
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "bottom":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "top-left":
        case "top-right":
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "bottom-left":
        case "bottom-right":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      // Round to grid size
      const roundedHeight = Math.round(newHeight / GRID_SIZE) * GRID_SIZE;

      // Update only height, width is handled by the grid
      setSize((prev) => ({
        ...prev,
        height: roundedHeight,
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      isResizing.current = false;
      document.body.style.cursor = "default";

      // Hide grid on resize end
      document.body.classList.remove("dragging-active");
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

  // Card styles - set fixed height of 60px when collapsed
  const cardStyles = {
    height: isCollapsed
      ? "60px"
      : typeof size.height === "number"
        ? `${size.height}px`
        : size.height,
    cursor: isDragging ? "grabbing" : getResizeCursor(),
    transition: isResizing.current ? "none" : transition,
  };

  return (
    <>
      {isModalOpen && (
        <div
          data-testid="modal"
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-120 modal backdrop-blur-sm"
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
                <button
                  data-testid="modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  <Icons variant="close" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 p-4 overflow-y-auto">
              {children}
            </div>
            {footer && (
              <div className="">
                {true ? (
                  <CardFooter
                    category={category}
                    onAction={onAction}
                    patientId={patientId}
                  />
                ) : (
                  <div className="h-8 bg-gray-100 animate-pulse" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {!isModalOpen && (
        <div
          ref={setNodeRef}
          data-testid="draggable-card"
          className="m-2 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            ...cardStyles,
            ...style,
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header is always visible */}
            <div
              ref={headerRef}
              className="cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <Header
                title={title}
                isCollapsed={isCollapsed}
                handleCollapse={handleCollapse}
                handleExpandModal={handleExpandModal}
                isKebabMenuOpen={isKebabMenuOpen}
                toggleKebabMenu={toggleKebabMenu}
                kebabMenuRef={kebabMenuRef}
                icon={icon}
                onMouseDown={() => {}} // dnd-kit handles this now
                isDragging={isDragging}
              />
            </div>

            {/* Content is only shown when not collapsed */}
            {!isCollapsed && (
              <>
                <CustomScroll heightRelativeToParent="calc(100% - 100px)">
                  <div className="flex-1 p-4 overflow-y-auto">{children}</div>
                </CustomScroll>
              </>
            )}

            {/* Footer is only shown when not collapsed */}
            {!isCollapsed && footer && (
              <div
                className="mt-auto"
                style={{ display: isCollapsed ? "none" : "block" }}
              >
                <CardFooter
                  category={category}
                  patientId={patientId}
                  onAction={onAction}
                />
              </div>
            )}
          </div>

          {/* Resize handles are only shown when not collapsed */}
          {!isCollapsed && (
            <>
              {/* Only show vertical resize handles since width is controlled by grid */}
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Card;