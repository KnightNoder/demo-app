import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { setAuthToken } from "./api/axiosClient";
import "./App.css";

// Import custom hooks
import { usePermissions } from "./hooks/usePermissions";
import { useWidgets } from "./hooks/useWidgets";
import { useResponsive } from "./hooks/useResponsive";
import { useCarousel } from "./hooks/useCarousel";
// Remove the unused hook import if you're not using it directly
// import { useModalState } from "./hooks/useModalState";

// Import components
import WidgetMenu from "./components/molecules/WidgetMenu/WidgetMenu";
import MobileView from "./components/organisms/MobileView/MobileView";
import DesktopView from "./components/organisms/DesktopView/DesktopView";
import AppModal from "./components/molecules/Modal/AppModal";

// Import configuration
import { widgetOptions } from "./config/widgets";
import { CardActionHandler } from "./types";
import { getCategoryUrl } from "./utils/urlHelpers";

const App: React.FC = () => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);
  // Track a single global modal state instead of multiple unused states
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [isExpandAll, setIsExpandAll] = useState(true);

  // Modal state management - simplified
  const [modal, setModal] = useState({
    isOpen: false,
    url: "",
    title: "",
  });

  // Use custom hooks
  const { insuranceWritePermission } = usePermissions();
  const {
    visibleWidgets,
    authorizedWidgets,
    gridItems,
    setGridItems,
    toggleWidget,
    isStrictAuditor,
  } = useWidgets();
  const { isMobileView, getGridTemplateColumns } = useResponsive();
  const { activeCardIndex, setActiveCardIndex, nextCard, prevCard } =
    useCarousel(gridItems, isMobileView);

  // Configure sensors for dragging
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get patient ID from input element
  useEffect(() => {
    const patientIdInput = document.querySelector<HTMLInputElement>(
      'input[name="patient_id"]'
    );
    if (patientIdInput) {
      setPatientId(patientIdInput.value);
    }
  }, [visibleWidgets, authorizedWidgets, isStrictAuditor]);

  // Handle JWT token
  useEffect(() => {
    if ((window as any).JWT_AUTH_TOKEN) {
      setAuthToken((window as any).JWT_AUTH_TOKEN);
    }
  }, []);

  // Watch for modal state changes from all components
  useEffect(() => {
    const handleModalStateChange = (
      event: CustomEvent<{ isOpen: boolean }>
    ) => {
      const { isOpen } = event.detail;

      // Update our single global modal state
      setIsAnyModalOpen(isOpen);

      // If modal is being closed, also close the main modal
      if (!isOpen) {
        setModal((prev) => ({ ...prev, isOpen: false }));
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
  }, []);

  // Sync modal.isOpen with isAnyModalOpen
  useEffect(() => {
    if (modal.isOpen && !isAnyModalOpen) {
      setIsAnyModalOpen(true);
    }
  }, [modal.isOpen, isAnyModalOpen]);

  // Listen for the closeAllModals event
  useEffect(() => {
    const handleCloseAllModals = () => {
      // Close main modal
      setModal((prev) => ({ ...prev, isOpen: false }));

      // Reset modal state
      setIsAnyModalOpen(false);

      // Close widget menu if it's open
      setIsWidgetMenuOpen(false);

      // Dispatch a global modal state change event
      const modalCloseEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: false },
      });
      document.dispatchEvent(modalCloseEvent);
    };

    // Add event listener for closing all modals
    document.addEventListener("closeAllModals", handleCloseAllModals);

    // Cleanup
    return () => {
      document.removeEventListener("closeAllModals", handleCloseAllModals);
    };
  }, []);

  // Open modal function
  const openModal = (category: string | null, patientId: string | null) => {
    const url = getCategoryUrl(category, patientId);

    if (!url) {
      console.warn(`No URL configured for category: ${category}`);
      return;
    }

    // Update modal state
    setModal({
      isOpen: true,
      url,
      title: category || "Content",
    });

    // Update the global modal state
    setIsAnyModalOpen(true);

    // Dispatch event to notify other components
    const event = new CustomEvent("modalStateChange", {
      detail: { isOpen: true, modalType: "footer" },
    });
    document.dispatchEvent(event);
  };

  // Close modal function
  const closeModal = () => {
    // Update modal state
    setModal((prev) => ({ ...prev, isOpen: false }));

    // Keep isAnyModalOpen true if there might be other modals open
    // We'll let the event handler manage this state

    // Dispatch event to notify other components
    const event = new CustomEvent("modalStateChange", {
      detail: { isOpen: false },
    });
    document.dispatchEvent(event);
  };

  // Card action handler
  const handleCardAction: CardActionHandler = (action, category) => {
    // Check if category is null
    if (!category) {
      console.warn("Category is null or undefined");
      return;
    }

    // Only allow actions on authorized widgets
    if (!authorizedWidgets.includes(category)) {
      console.warn(`Widget ${category} is not authorized by ACL`);
      return;
    }

    if (action === "add") {
      openModal(category, patientId);
    } else if (action === "view") {
      console.log(`View history for ${category}`);
    }
  };

  // Handle modal state change from WidgetMenu
  const handleWidgetModalStateChange = (isOpen: boolean) => {
    // Update the global modal state
    setIsAnyModalOpen(isOpen);
  };

  // Handler for drag start
  const handleDragStart = () => {
    // Add a class to body to indicate dragging is active
    document.body.classList.add("dragging-active");
  };

  // Handler for drag end - This is where rearrangement happens
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Only reorder if there's an over element and it's different from the active element
    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      // Find the positions in the array
      const activeItem = gridItems.find((item) => item.id === activeId);
      const overItem = gridItems.find((item) => item.id === overId);

      if (activeItem && overItem) {
        // Reorder the items
        setGridItems((items) => {
          // Create a new array
          const newItems = [...items];

          // Find the indexes
          const activeIndex = items.findIndex((item) => item.id === activeId);
          const overIndex = items.findIndex((item) => item.id === overId);

          // Swap
          newItems.splice(activeIndex, 1);
          newItems.splice(overIndex, 0, activeItem);

          // Update order property
          return newItems?.map((item, index) => ({
            ...item,
            order: index,
          }));
        });
      }
    }

    // Remove the body class
    document.body.classList.remove("dragging-active");
  };

  return (
    <Provider store={store}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ToastContainer />
        <div
          className={`relative w-full min-h-screen ${isAnyModalOpen ? "pt-4" : "pt-4"} bg-[#F4F5FB]`}
        >
          <WidgetMenu
            widgetOptions={widgetOptions}
            visibleWidgets={visibleWidgets}
            authorizedWidgets={authorizedWidgets}
            toggleWidget={toggleWidget}
            isWidgetMenuOpen={isWidgetMenuOpen}
            setIsWidgetMenuOpen={setIsWidgetMenuOpen}
            isMobileView={isMobileView}
            isAnyModalOpen={isAnyModalOpen} // Pass consolidated modal state
            patientId={patientId}
            onModalStateChange={handleWidgetModalStateChange}
            setIsExpandAll={setIsExpandAll}
          />

          {/* Grid Container */}
          <div className="relative w-full" style={{ zIndex: 10 }}>
            <div className={`${isMobileView ? "" : "mx-[30px]"}`}>
              {isMobileView ? (
                /* Mobile Carousel View */
                <MobileView
                  gridItems={gridItems}
                  activeCardIndex={activeCardIndex}
                  setActiveCardIndex={setActiveCardIndex}
                  nextCard={nextCard}
                  prevCard={prevCard}
                  widgetOptions={widgetOptions?.filter((opt) =>
                    authorizedWidgets.includes(opt.key)
                  )}
                  onAction={handleCardAction}
                  patientId={patientId}
                  isAnyModalOpen={isAnyModalOpen} // Pass consolidated modal state
                  insuranceWritePermission={insuranceWritePermission}
                  isStrictAuditor={isStrictAuditor}
                  isExpandAll={isExpandAll}
                />
              ) : (
                /* Desktop Grid View */
                <DesktopView
                  gridItems={gridItems}
                  widgetOptions={widgetOptions?.filter((opt) =>
                    authorizedWidgets.includes(opt.key)
                  )}
                  onAction={handleCardAction}
                  patientId={patientId}
                  isAnyModalOpen={isAnyModalOpen} // Pass consolidated modal state
                  insuranceWritePermission={insuranceWritePermission}
                  gridTemplateColumns={getGridTemplateColumns()}
                  isStrictAuditor={isStrictAuditor}
                  isExpandAll={isExpandAll}
                />
              )}
            </div>
          </div>

          {/* Use AppModal directly */}
          <AppModal modal={modal} closeModal={closeModal} />
        </div>
      </DndContext>
    </Provider>
  );
};

export default App;