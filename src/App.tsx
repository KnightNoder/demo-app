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
import { useModal } from "./hooks/useModal";
import { useCarousel } from "./hooks/useCarousel";

// Import components
import WidgetMenu from "./components/molecules/WidgetMenu/WidgetMenu";
import MobileView from "./components/organisms/MobileView/MobileView";
import DesktopView from "./components/organisms/DesktopView/DesktopView";
import AppModal from "./components/molecules/Modal/AppModal";

// Import configuration
import { widgetOptions } from "./config/widgets";
import { CardActionHandler } from "./types";

const App: React.FC = () => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false); // Track widget modal state
  const [isExpandAll, setIsExpandAll] = useState(true); // Track expand all state

  // Use custom hooks
  const { insuranceWritePermission } = usePermissions();
  const {
    visibleWidgets,
    authorizedWidgets,
    gridItems,
    setGridItems,
    toggleWidget,
    isStrictAuditor, // Access the isStrictAuditor flag
  } = useWidgets();
  const { isMobileView, getGridTemplateColumns } = useResponsive();
  const { modal, isAnyModalOpen, openModal, closeModal } = useModal();
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

  // Track any modal being open (from either source)
  const isModalVisible = isAnyModalOpen || isWidgetModalOpen;

  // Get patient ID from input element
  useEffect(() => {
    console.log(visibleWidgets, "visibleWidgets");
    console.log(authorizedWidgets, "authorizedWidgets");
    console.log(isStrictAuditor, "isStrictAuditor"); // Log the isStrictAuditor flag

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

  useEffect(() => {
    const handleGlobalModalState = (
      event: CustomEvent<{ isOpen: boolean }>
    ) => {
      const { isOpen } = event.detail;

      // Track widget modal state in coordination with all other modals
      if (!isOpen && isWidgetModalOpen) {
        // Don't automatically close the widget menu if widget modal is still open
        return;
      }

      // When any modal closes, check if we should update the widget menu visibility
      if (!isOpen && !modal.isOpen) {
        setIsWidgetMenuOpen(false);
      }
    };

    // Listen for iframe modal closure separately
    const handleIframeModalClosed = () => {
      // Don't automatically reset all modal states when an iframe modal closes
      // Let the modal stack handle itself through the modalStateChange events
      console.log("Iframe modal closed");
    };

    document.addEventListener(
      "modalStateChange",
      handleGlobalModalState as EventListener
    );

    document.addEventListener(
      "iframeModalClosed",
      handleIframeModalClosed as EventListener
    );

    return () => {
      document.removeEventListener(
        "modalStateChange",
        handleGlobalModalState as EventListener
      );

      document.removeEventListener(
        "iframeModalClosed",
        handleIframeModalClosed as EventListener
      );
    };
  }, [isWidgetModalOpen, modal.isOpen]);

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
      `View history for ${category}`;
    }
  };

  // Handle modal state change from WidgetMenu
  const handleWidgetModalStateChange = (isOpen: boolean) => {
    setIsWidgetModalOpen(isOpen);

    // When widget modal opens, also ensure we track it in the global modal state
    if (isOpen) {
      document.dispatchEvent(
        new CustomEvent("modalStateChange", { detail: { isOpen: true } })
      );
    }

    // We don't dispatch a close event here - the modal itself will do that
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
          return newItems.map((item, index) => ({
            ...item,
            order: index,
          }));
        });
      }
    }

    // Remove the body class
    document.body.classList.remove("dragging-active");
  };

  console.log("Current environment:", process.env.NODE_ENV);
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
          className={`relative w-full min-h-screen ${isModalVisible ? "pt-4 md:pt-12" : "pt-4 md:pt-12"} bg-[#F4F5FB]`}
        >
          <WidgetMenu
            widgetOptions={widgetOptions}
            visibleWidgets={visibleWidgets}
            authorizedWidgets={authorizedWidgets}
            toggleWidget={toggleWidget}
            isWidgetMenuOpen={isWidgetMenuOpen}
            setIsWidgetMenuOpen={setIsWidgetMenuOpen}
            isMobileView={isMobileView}
            isAnyModalOpen={isAnyModalOpen}
            patientId={patientId}
            onModalStateChange={handleWidgetModalStateChange}
            setIsExpandAll={setIsExpandAll}
          />
          {/* Widget menu - Pass the authorizedWidgets prop and modal state handler */}

          {/* Grid Container */}
          <div className="relative w-full" style={{ zIndex: 10 }}>
            <div className={`${isMobileView ? "" : "mx-[50px]"}`}>
              {isMobileView ? (
                /* Mobile Carousel View */
                <MobileView
                  gridItems={gridItems}
                  activeCardIndex={activeCardIndex}
                  setActiveCardIndex={setActiveCardIndex}
                  nextCard={nextCard}
                  prevCard={prevCard}
                  widgetOptions={widgetOptions.filter((opt) =>
                    authorizedWidgets.includes(opt.key)
                  )} // Filter to only authorized widgets
                  onAction={handleCardAction}
                  patientId={patientId}
                  isAnyModalOpen={isAnyModalOpen}
                  insuranceWritePermission={insuranceWritePermission}
                  isStrictAuditor={isStrictAuditor} // Pass the isStrictAuditor flag
                  isExpandAll={isExpandAll}
                />
              ) : (
                /* Desktop Grid View */
                <DesktopView
                  gridItems={gridItems}
                  widgetOptions={widgetOptions.filter((opt) =>
                    authorizedWidgets.includes(opt.key)
                  )} // Filter to only authorized widgets
                  onAction={handleCardAction}
                  patientId={patientId}
                  isAnyModalOpen={isAnyModalOpen}
                  insuranceWritePermission={insuranceWritePermission}
                  gridTemplateColumns={getGridTemplateColumns()}
                  isStrictAuditor={isStrictAuditor} // Pass the isStrictAuditor flag
                  isExpandAll={isExpandAll}
                />
              )}
            </div>
          </div>

          {/* Modal */}
          <AppModal modal={modal} closeModal={closeModal} />
        </div>
      </DndContext>
    </Provider>
  );
};

export default App;