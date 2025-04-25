import React, { useState, useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";
import Header from "../../molecules/CardHeader/CardHeader";
import CardFooter from "../../molecules/CardFooter/CardFooter";
import { CustomScroll } from "react-custom-scroll";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  iconBgColor?: string;
  hasWritePermission?: boolean;
  isAnyModalOpen?: boolean;
  isStrictAuditor?: boolean; // Optional prop for strict auditor
  isExpandAll?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  // initialPosition,
  category,
  patientId,
  icon,
  onAction,
  id,
  order,
  iconBgColor,
  hasWritePermission,
  isAnyModalOpen,
  isStrictAuditor,
  isExpandAll,
}) => {
  // Track the card's collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Update isCollapsed when isExpandAll changes
  useEffect(() => {
    if (isExpandAll !== undefined) {
      setIsCollapsed(!isExpandAll);
    }
  }, [isExpandAll]);

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
    zIndex: isDragging ? 11 : 10,
  };

  // Effect to manage modal state changes
  useEffect(() => {
    // When modal state changes, dispatch the appropriate event
    if (isModalOpen) {
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: true },
      });
      document.dispatchEvent(modalOpenEvent);
    } else {
      const modalCloseEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: false },
      });
      document.dispatchEvent(modalCloseEvent);
    }
  }, [isModalOpen]);

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

  const handleCollapse = () => {
    // Simply toggle the card's collapse state when clicked
    setIsCollapsed((prev) => !prev);
  };

  const handleExpandModal = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Close kebab menu when opening modal to prevent overlap
    setIsKebabMenuOpen(false);
    setIsModalOpen(true);

    // Dispatch a custom event to notify App component that a modal is open
    const modalOpenEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: true },
    });
    document.dispatchEvent(modalOpenEvent);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    // Prevent the event from reaching the document click handler
    e.stopPropagation();

    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);

      // Always dispatch the close event when closing the modal
      const modalCloseEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: false },
      });
      document.dispatchEvent(modalCloseEvent);
    }
  };

  const toggleKebabMenu = () => {
    setIsKebabMenuOpen((prev) => !prev);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);

    // Dispatch a custom event to notify App component that a modal is closed
    const modalCloseEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: false },
    });
    document.dispatchEvent(modalCloseEvent);
  };

  const grabIndicatorStyle = {
    height: "4px",
    width: "40px",
    backgroundColor: "#E2E8F0",
    margin: "0 auto 4px auto",
    borderRadius: "2px",
  };

  // Card styles - set height based on the collapsed state
  const cardStyles = {
    height: isCollapsed ? "80px" : "500px",
    cursor: isDragging ? "grabbing" : "default",
    transition: transition,
  };

  // Updated modal component to prevent event propagation issues
  const modalComponent = isModalOpen ? (
    <div
      data-testid="modal"
      className="fixed inset-0 flex items-center justify-center bg-[#000000CC] z-99 modal"
      onClick={handleCloseModal}
      // Prevent clicks on the modal background from affecting other components
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        className={`bg-white p-4 rounded-lg shadow-lg w-[90%] ${isAnyModalOpen ? "max-w-[100%]" : "max-w-[50%]"} h-[80%] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 pr-10">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center gap-4">
            <button onClick={(e) => e.stopPropagation()}>
              <Icons variant="print" />
            </button>
            <button onClick={(e) => e.stopPropagation()}>
              <Icons variant="share" />
            </button>
            <button onClick={(e) => e.stopPropagation()}>
              <Icons variant="download" />
            </button>
            <button onClick={(e) => e.stopPropagation()}>
              <Icons variant="delete" />
            </button>
            <button data-testid="modal-close" onClick={handleModalClose}>
              <Icons variant="close" />
            </button>
          </div>
        </div>
        <div className="relative flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 px-4 pb-4 overflow-y-auto">{children}</div>
          {footer && (
            <div className="mt-auto">
              {true ? (
                <CardFooter
                  category={category}
                  onAction={onAction}
                  patientId={patientId}
                  hasWritePermission={hasWritePermission}
                  isStrictAuditor={isStrictAuditor}
                />
              ) : (
                <div className="h-8 bg-gray-100 animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Render modal as a portal-like element at the end to avoid widget menu conflicts */}
      {modalComponent}

      <div
        ref={setNodeRef}
        data-testid="draggable-card"
        className="m-2 bg-white border border-gray-200 rounded-lg shadow-md"
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
            <div
              className="pt-2 flex justify-center"
              style={{ cursor: "grab" }}
            >
              <div style={grabIndicatorStyle}></div>
            </div>
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
              iconBgColor={iconBgColor}
              isExpandAll={isExpandAll}
            />
          </div>

          {/* Content is only shown when not collapsed */}
          {!isCollapsed && (
            <CustomScroll heightRelativeToParent="calc(100% - 100px)">
              <div className="flex-1 p-4 overflow-y-auto">{children}</div>
            </CustomScroll>
          )}

          {/* Footer is only shown when not collapsed */}
          {!isCollapsed && footer && (
            <div className="mt-auto">
              <CardFooter
                category={category}
                patientId={patientId}
                onAction={onAction}
                hasWritePermission={hasWritePermission}
                isStrictAuditor={isStrictAuditor}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;