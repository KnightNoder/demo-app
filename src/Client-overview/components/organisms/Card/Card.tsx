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
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const headerModalRef = useRef<HTMLDivElement>(null);
  const footerModalRef = useRef<HTMLDivElement>(null);
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
    zIndex: isDragging ? 11 : 10,
  };

  // Listen for global modal state changes
  useEffect(() => {
    const handleModalStateChange = (
      event: CustomEvent<{
        isOpen: boolean;
        modalType?: string;
        sourceId?: string;
      }>
    ) => {
      const { isOpen, modalType, sourceId } = event.detail;

      // Only process events that aren't from this component (to avoid loops)
      // or events without a sourceId (for backwards compatibility)
      if (!sourceId || sourceId !== id) {
        if (!isOpen) {
          // When any modal is closed, update all local modal states
          setIsHeaderModalOpen(false);
          setIsFooterModalOpen(false);
        } else if (modalType) {
          // Update specific modal state based on type
          if (modalType === "header") {
            // If another card's header modal is opening, close this one
            if (sourceId && sourceId !== id) {
              setIsHeaderModalOpen(false);
            }
          }
        }
      }
    };

    document.addEventListener(
      "modalStateChange",
      handleModalStateChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "modalStateChange",
        handleModalStateChange as EventListener
      );
    };
  }, [id]);

  // Effect to dispatch event when header modal state changes
  useEffect(() => {
    if (isHeaderModalOpen) {
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: {
          isOpen: true,
          modalType: "header",
          sourceId: id, // Add source ID to prevent loops
        },
      });
      document.dispatchEvent(modalOpenEvent);
    }
  }, [isHeaderModalOpen, id]);

  // Effect to dispatch event when footer modal state changes
  useEffect(() => {
    if (isFooterModalOpen) {
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: {
          isOpen: true,
          modalType: "footer",
          sourceId: id, // Add source ID to prevent loops
        },
      });
      document.dispatchEvent(modalOpenEvent);
    }
  }, [isFooterModalOpen, id]);

  // Handle close for header modal
  const handleHeaderModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setIsHeaderModalOpen(false);

    // Dispatch a modal state change event
    const modalCloseEvent = new CustomEvent("modalStateChange", {
      detail: {
        isOpen: false,
        sourceId: id, // Add source ID to prevent loops
      },
    });
    document.dispatchEvent(modalCloseEvent);
  };

  // Handle close for footer modal
  const handleFooterModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setIsFooterModalOpen(false);

    // Dispatch a modal state change event
    const modalCloseEvent = new CustomEvent("modalStateChange", {
      detail: {
        isOpen: false,
        sourceId: id, // Add source ID to prevent loops
      },
    });
    document.dispatchEvent(modalCloseEvent);
  };

  // Handle keypresses and outside clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        if (isHeaderModalOpen) {
          handleHeaderModalClose();
        }
        if (isFooterModalOpen) {
          handleFooterModalClose();
        }
        setIsKebabMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Handle kebab menu close
      if (
        kebabMenuRef.current &&
        !kebabMenuRef.current.contains(e.target as Node)
      ) {
        setIsKebabMenuOpen(false);
      }

      // Handle header modal close when clicking outside
      if (
        isHeaderModalOpen &&
        headerModalRef.current &&
        !headerModalRef.current.contains(e.target as Node)
      ) {
        handleHeaderModalClose();
      }

      // Handle footer modal close when clicking outside
      if (
        isFooterModalOpen &&
        footerModalRef.current &&
        !footerModalRef.current.contains(e.target as Node)
      ) {
        handleFooterModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeaderModalOpen, isFooterModalOpen]);

  const handleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleExpandModal = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Close kebab menu when opening modal to prevent overlap
    setIsKebabMenuOpen(false);
    setIsHeaderModalOpen(true);
  };

  // Handle add action from footer
  const handleAddAction = (action: "add" | "view", category: string | null) => {
    if (onAction) {
      onAction(action, category);
      setIsFooterModalOpen(true);
    }
  };

  // Listen for iframe modal closure events
  useEffect(() => {
    const handleIframeModalClosed = () => {
      // When iframe modal is closed, we don't need to close the card modal
    };

    document.addEventListener("iframeModalClosed", handleIframeModalClosed);

    return () => {
      document.removeEventListener(
        "iframeModalClosed",
        handleIframeModalClosed
      );
    };
  }, []);

  const toggleKebabMenu = () => {
    setIsKebabMenuOpen((prev) => !prev);
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

  // Header modal component
  const headerModalComponent = isHeaderModalOpen ? (
    <div
      data-testid="header-modal"
      data-modal-type="header"
      className="fixed inset-0 flex items-center justify-center bg-[#000000CC] z-99 modal"
    >
      <div
        ref={headerModalRef}
        className={`bg-white p-4 rounded-lg shadow-lg w-[90%] ${isAnyModalOpen ? "max-w-[100%]" : "max-w-[50%]"} h-[80%] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 px-4">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center gap-4">
            {/* <button onClick={(e) => e.stopPropagation()}>
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
            </button> */}
            <button data-testid="modal-close" onClick={handleHeaderModalClose}>
              <Icons variant="close" />
            </button>
          </div>
        </div>
        <div className="relative flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 px-4 mt-4 pb-4 overflow-y-auto">
            {children}
          </div>
          {footer && (
            <div className="mt-auto">
              {true ? (
                <CardFooter
                  category={category}
                  onAction={handleAddAction}
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
      {headerModalComponent}

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
              <div className="flex-1 p-4 overflow-y-auto h-full">
                {children}
              </div>
            </CustomScroll>
          )}

          {/* Footer is only shown when not collapsed */}
          {!isCollapsed && footer && (
            <div className="mt-auto">
              <CardFooter
                category={category}
                patientId={patientId}
                onAction={handleAddAction}
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