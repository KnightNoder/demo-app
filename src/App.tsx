import React, { useEffect, useState, useRef } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Card from "./components/organisms/Card/Card";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import IframeModal from "./components/molecules/Modal/IframeModal";
import { setAuthToken } from "./services/api";
import Icons from "./assets/Icons/Icons";

// Import all your card components
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "./components/organisms/AllergiesCard/AllergiesCard";
import MedicationsCard from "./components/organisms/MedicationsCard/MedicationsCard";
import ClinicalNotesCard from "./components/organisms/ClinicalNotesCard/ClinicalNotesCard";
import InsuranceCard from "./components/organisms/InsuranceCard/InsuranceCard";
import LabReportsCard from "./components/organisms/LabReportsCard/LabReportsCard";
import DocumentsCard from "./components/organisms/DocumentsCard/DocumentsCard";
import PrescriptionCard from "./components/organisms/PrescriptionCard/PrescriptionCard";
import AppointmentsCard from "./components/organisms/AppointmentsCard/AppointmentsCard";
import NotificationCard from "./components/organisms/NotificationsCard/NotificationsCard";
import DemographicsCard from "./components/organisms/Demographics/Demographics";
import PhotosCard from "./components/organisms/PhotosCard/PhotosCard";
import VitalsCard from "./components/organisms/VitalsCard/VitalsCard";
import DisclosuresCard from "./components/organisms/DisclosuresCard/DisclosuresCard";
import FunctionalStatusCard from "./components/organisms/FunctionalStatusCard/FunctionalStatusCard";
import CognitiveStatusCard from "./components/organisms/CognitiveStatusCard/CognitiveStatusCard";
import AdvancedDirectivesCard from "./components/organisms/AdvancedDirectivesCard/AdvancedDirectivesCard";
import "./App.css";

// Define grid gap
const GRID_GAP = 20;
const CARD_BASE_WIDTH = 650; // Base card width for calculating responsive widths

// Define the interface for grid items
interface GridItem {
  id: string;
  order: number;
}

// Screen size breakpoints (in pixels)
// const SCREEN_SM = 640;  // Mobile
const SCREEN_MD = 768;  // Small tablet
const SCREEN_LG = 1024; // Large tablet
const SCREEN_XL = 1280; // Small desktop
const SCREEN_2XL = 1536; // Large desktop

const widgetOptions = [
  {
    key: "Allergies",
    component: AllergyCard,
    icon: "allergies",
    iconBgColor: "bg-rose-100",
  },
  {
    key: "Diagnosis",
    component: DiagnosisCard,
    icon: "diagnosis",
    iconBgColor: "bg-indigo-100",
  },
  {
    key: "Medications",
    component: MedicationsCard,
    icon: "medications",
    iconBgColor: "bg-orange-100",
  },
  {
    key: "Clinical Notes",
    component: ClinicalNotesCard,
    icon: "clinicalNotes",
    iconBgColor: "bg-emerald-100",
  },
  {
    key: "Insurance",
    component: InsuranceCard,
    iconBgColor: "bg-blue-100",
    icon: "insurance",
  },
  {
    key: "Lab Reports",
    component: LabReportsCard,
    iconBgColor: "bg-blue-100",
    icon: "lab-results",
  },
  {
    key: "Prescriptions",
    component: PrescriptionCard,
    iconBgColor: "bg-orange-100",
    icon: "prescriptions",
  },
  {
    key: "Documents",
    component: DocumentsCard,
    iconBgColor: "bg-orange-100",
    icon: "document",
  },
  {
    key: "Appointments",
    component: AppointmentsCard,
    iconBgColor: "bg-violet-100",
    icon: "appointments",
  },
  {
    key: "Notifications",
    component: NotificationCard,
    iconBgColor: "bg-amber-100",
    icon: "notifications",
  },
  {
    key: "Demographics",
    component: DemographicsCard,
    iconBgColor: "bg-green-100",
    icon: "demographics",
  },
  {
    key: "ID/Card Photos",
    component: PhotosCard,
    iconBgColor: "bg-purple-100",
    icon: "id-card",
  },
  {
    key: "Vitals",
    component: VitalsCard,
    iconBgColor: "bg-red-100",
    icon: "vitals",
  },
  {
    key: "Disclosures",
    component: DisclosuresCard,
    iconBgColor: "bg-teal-100",
    icon: "disclosures",
  },
  {
    key: "Functional Status",
    component: FunctionalStatusCard,
    iconBgColor: "bg-slate-100",
    icon: "functional-status",
  },
  {
    key: "Cognitive Status",
    component: CognitiveStatusCard,
    iconBgColor: "bg-slate-100",
    icon: "cognitive-status",
  },
  {
    key: "Advanced Directives",
    component: AdvancedDirectivesCard,
    iconBgColor: "bg-purple-100",
    icon: "advanced-directives",
  },
];

const getCategoryUrl = (
  category: string | null,
  patientId: string | null
): string => {
  switch (category) {
    case "Allergies":
      return `https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=allergy`;
    case "Appointments":
      return `https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/main/calendar/add_edit_event2.php?startampm=1&starttimeh=6&starttimem=0&patientid=${patientId}&ptype=patient`;
    case "Diagnosis":
      return `https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medical_problem`;
    case "Advanced Directive":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/advancedirectives.php";
    case "Medications":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medication";
    case "Insurance":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix//interface/patient_file/summary/add_insurance.php";
    case "Prescriptions":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/rx_frameset.php";
    case "Demographics":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/demographics_full.php?curr_tab=Who";
    case "Functional Status":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=functional_status";
    case "Cognitive Status":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=cognitive_status";
    case "Advanced Directives":
      return "https://qa-linux-01.drcloudemr.com/qa-phoenix/interface/patient_file/summary/advancedirectives.php";
    default:
      return "";
  }
};

interface ModalInfo {
  isOpen: boolean;
  url: string;
  title: string;
}

const App: React.FC = () => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>([
    "Allergies",
    "Diagnosis",
    "Medications",
    "Insurance",
    "Clinical Notes",
    "Lab Reports",
    "Prescriptions",
    "Documents",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // State for window width to determine the number of columns
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : SCREEN_LG
  );

  // State for current carousel card index (for mobile view)
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // State for active dragging widget
  const [, setActiveDragWidget] = useState<string | null>(null);

  // State for grid items
  const [gridItems, setGridItems] = useState<GridItem[]>([]);

  // Determine whether to show carousel based on screen width
  const isMobileView = windowWidth < SCREEN_MD;

  // Determine number of columns based on screen width
  const getGridColumns = () => {
    if (windowWidth >= SCREEN_2XL) return 4;
    if (windowWidth >= SCREEN_XL) return 3;
    if (windowWidth >= SCREEN_MD) return 2;
    return 1; // Mobile will use carousel
  };

  // Configure sensors for dragging
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 5 pixels before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  // State for the modal
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    url: "",
    title: "",
  });

  // Initialize grid items from visible widgets
  useEffect(() => {
    const items = visibleWidgets.map((widgetKey, index) => ({
      id: widgetKey,
      order: index,
    }));
    setGridItems(items);
  }, [visibleWidgets]);

  // Add event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Initial call to set the correct width
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Reset active card index when switching between mobile and desktop view
  useEffect(() => {
    if (isMobileView && activeCardIndex >= gridItems.length) {
      setActiveCardIndex(0);
    }
  }, [isMobileView, gridItems.length, activeCardIndex]);

  const openModal = (category: string | null, patientId: string | null) => {
    const url = getCategoryUrl(category, patientId);
    if (!url) {
      console.warn(`No URL configured for category: ${category}`);
      return;
    }

    setModal({
      isOpen: true,
      url,
      title: category || "Content",
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const patientIdInput = document.querySelector<HTMLInputElement>(
      'input[name="patient_id"]'
    );
    if (patientIdInput) {
      setPatientId(patientIdInput.value);
    }
  }, []);

  useEffect(() => {
    // JWT token handling
    if ((window as any).JWT_AUTH_TOKEN) {
      setAuthToken((window as any).JWT_AUTH_TOKEN);
      console.log(
        "Token stored in localStorage:",
        (window as any).JWT_AUTH_TOKEN
      );
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsWidgetMenuOpen(false);
      }
    };

    if (isWidgetMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWidgetMenuOpen]);

  const showWidgetToast = (widgetKey: string, isAdding: boolean) => {
    toast(
      <div className="p-2">
        <h3 className="text-lg font-bold">
          {isAdding ? "Widget Added" : "Widget Removed"}
        </h3>
        <p className="font-semibold">{widgetKey}</p>
        <p className="text-sm text-gray-600">
          {isAdding
            ? "The widget has been added to your dashboard. You can now view and interact with it."
            : "The widget has been removed from your dashboard."}
        </p>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "rounded-md shadow-lg bg-white",
      }
    );
  };

  const toggleWidget = (widgetKey: string) => {
    setVisibleWidgets((prevWidgets) => {
      const isAdding = !prevWidgets.includes(widgetKey);
      showWidgetToast(widgetKey, isAdding);

      if (isAdding) {
        // Add the widget to the grid items with the next order number
        const newOrder = gridItems.length;
        setGridItems((prev) => [...prev, { id: widgetKey, order: newOrder }]);
        return [...prevWidgets, widgetKey];
      } else {
        // Remove the widget from grid items
        setGridItems((prev) => prev.filter((item) => item.id !== widgetKey));
        // Reorder remaining items
        setGridItems((prev) =>
          prev.map((item, index) => ({ ...item, order: index }))
        );
        return prevWidgets.filter((w) => w !== widgetKey);
      }
    });
  };

  // Handler for drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragWidget(active.id as string);

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

    setActiveDragWidget(null);

    // Remove the body class
    document.body.classList.remove("dragging-active");
  };

  // Move to the next card in the carousel
  const nextCard = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === gridItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Move to the previous card in the carousel
  const prevCard = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === 0 ? gridItems.length - 1 : prevIndex - 1
    );
  };

  // Render the carousel navigation UI
  const renderCarouselNavigation = () => (
    <div className="flex items-center justify-between px-4 mt-4 mb-4">
      <button
        onClick={prevCard}
        className="flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        aria-label="Previous card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="text-sm text-gray-600">
        {activeCardIndex + 1} / {gridItems.length}
      </div>
      <button
        onClick={nextCard}
        className="flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        aria-label="Next card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );

  // Render dots for carousel navigation
  const renderCarouselDots = () => (
    <div className="flex justify-center mt-2 mb-4">
      {gridItems.map((_, index) => (
        <button
          key={`dot-${index}`}
          onClick={() => setActiveCardIndex(index)}
          className={`w-2 h-2 mx-1 rounded-full transition-colors ${
            index === activeCardIndex ? "bg-blue-500" : "bg-gray-300"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );

  // Get the current grid columns count based on screen size
  const gridColumns = getGridColumns();

  // Calculate the maximum width of the grid container based on screen size and columns
  const getGridContainerStyle = () => {
    // For mobile view (carousel), we'll use full width
    if (isMobileView) {
      return {
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
      };
    }

    // For desktop view, calculate based on number of columns
    const totalWidth =
      gridColumns * CARD_BASE_WIDTH + (gridColumns - 1) * GRID_GAP;

    // Ensure the grid doesn't get too wide on very large screens
    const maxWidth = Math.min(totalWidth, windowWidth * 0.95);

    return {
      display: "grid",
      gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      gap: `${GRID_GAP}px`,
      width: "100%",
      maxWidth: `${maxWidth}px`,
      margin: "0 auto",
    };
  };

  // Get style for mobile menu position
  const getWidgetMenuPosition = () => {
    if (windowWidth < SCREEN_MD) {
      // Mobile view
      return {
        position: "relative" as const,
        zIndex: 999,
        margin: "0 auto",
        width: "100%",
        justifyContent: "center",
        padding: "0 1rem",
      };
    } else if (windowWidth < SCREEN_XL) {
      // Tablet view
      return {
        position: "relative" as const,
        zIndex: 999,
        margin: "0 auto",
        marginLeft: "2rem",
      };
    } else {
      // Desktop view
      return {
        position: "relative" as const,
        zIndex: 999,
        marginLeft: Math.min(800, windowWidth * 0.4) + "px",
      };
    }
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
        <div className="relative w-full min-h-screen pt-4 md:pt-12 bg-[#F4F5FB]">
          {/* Widget menu - Moved OUTSIDE and BEFORE the grid container */}
          <div
            className="relative z-50 flex mx-auto mb-4 transform"
            ref={widgetRef}
            style={getWidgetMenuPosition()}
          >
            {/* Widgets button - separated from other buttons */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
                className="flex items-center p-2 space-x-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
              >
                <Icons variant="widgets" />
                <span>Widgets</span>
              </button>
            </div>

            {/* Separate continuous strip for other buttons - hide on mobile */}
            <div
              className={`${isMobileView ? "hidden" : "ml-6"} bg-white border border-gray-200 rounded-md shadow-sm`}
            >
              <div className="flex flex-wrap">
                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>Client Info</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>Clinical</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>Documents</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>Reports</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>Other</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>EDI</span>
                </button>

                <button className="flex items-center p-2 border-r border-gray-200 hover:bg-gray-50">
                  <span>External Links</span>
                </button>

                <button className="flex items-center p-2 hover:bg-gray-50">
                  <span>More Options</span>
                </button>
              </div>
            </div>

            {/* Widget menu dropdown - Adjusted z-index and positioning for mobile */}
            <div
              className={`absolute top-full mt-2 p-4 bg-white rounded-md shadow-lg transition-transform duration-300 ${
                isWidgetMenuOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              } ${isMobileView ? "left-0 right-0 w-[90vw] mx-auto" : "left-0 w-[500px]"}`}
              style={{ zIndex: 1000 }}
            >
              {/* Search input */}
              <div className="relative flex items-center">
                <Icons variant="search" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search widgets..."
                  className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50"
                />
              </div>

              {/* Widget grid - adapt to mobile with flex-col */}
              <div
                className={`${isMobileView ? "flex flex-col space-y-4" : "grid grid-cols-2 gap-4"} mt-4`}
              >
                {/* Add Widgets list */}
                <div>
                  <h3 className="pb-1 mb-2 font-bold">Add Widgets</h3>
                  <ul className="mt-4 overflow-auto max-h-60">
                    {widgetOptions
                      .filter(
                        (w) =>
                          !visibleWidgets.includes(w.key) &&
                          w.key.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((widget) => (
                        <li
                          key={widget.key}
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                        >
                          <span className="flex items-center space-x-2">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor}`}
                            >
                              <Icons variant={widget.icon} />
                            </div>
                            <span>{widget.key}</span>
                          </span>
                          <button
                            className="font-bold text-green-500"
                            onClick={() => toggleWidget(widget.key)}
                          >
                            +
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Remove Widgets list */}
                <div>
                  <h3 className="pb-1 mb-2 font-bold">Remove Widgets</h3>
                  <ul className="overflow-auto max-h-60">
                    {visibleWidgets
                      .filter((key) =>
                        key.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((key) => {
                        const widget = widgetOptions.find((w) => w.key === key);
                        return (
                          <li
                            key={key}
                            className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                          >
                            <span className="flex items-center space-x-2">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${widget?.iconBgColor}`}
                              >
                                <Icons variant={widget?.icon || "default"} />
                              </div>
                              <span>{key}</span>
                            </span>
                            <button
                              className="font-bold text-red-500"
                              onClick={() => toggleWidget(key)}
                            >
                              -
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Container - Lower z-index */}
          <div className="relative w-full" style={{ zIndex: 10 }}>
            <div className="container p-4 mx-auto">
              {/* For mobile view - show carousel navigation */}
              {isMobileView &&
                gridItems.length > 0 &&
                renderCarouselNavigation()}

              {/* Responsive grid container */}
              <div
                className={`relative grid-container ${isMobileView ? "carousel-container" : ""}`}
                style={getGridContainerStyle()}
              >
                <SortableContext
                  items={gridItems}
                  strategy={rectSortingStrategy}
                >
                  {/* Render the cards - carousel for mobile, grid for desktop */}
                  {gridItems.map((item, index) => {
                    const widget = widgetOptions.find((w) => w.key === item.id);
                    if (!widget) return null;

                    // For mobile view, only show the active card in the carousel
                    const isVisibleInCarousel = isMobileView
                      ? index === activeCardIndex
                      : true;

                    if (!isVisibleInCarousel) return null;

                    return (
                      <Card
                        key={widget.key}
                        id={widget.key}
                        title={widget.key}
                        footer={true}
                        category={widget.key}
                        order={item.order}
                        initialPosition={{ x: 0, y: 0 }} // Position is handled by grid layout
                        icon={widget.icon}
                        onAction={(action, category) => {
                          console.log(action, category, "clicked in app");
                          if (action === "add") {
                            console.log(action, "action add");
                            openModal(category, patientId);
                          } else if (action === "view") {
                            // Handle view history action
                            console.log(`View history for ${category}`);
                          }
                        }}
                        patientId={patientId}
                        iconBgColor={widget?.iconBgColor}
                      >
                        {widget.component && (
                          <widget.component patientId={patientId} />
                        )}
                      </Card>
                    );
                  })}
                </SortableContext>
              </div>

              {/* Show dots navigation for mobile carousel */}
              {isMobileView && gridItems.length > 1 && renderCarouselDots()}
            </div>
          </div>

          {/* Modal - Make it responsive for mobile */}
          {modal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-50 modal backdrop-blur-sm">
              <div className="relative bg-white p-2 md:p-4 rounded-lg shadow-lg w-full md:w-[80%] h-[90%] md:h-[80%] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h2 className="text-lg font-semibold md:text-xl">
                    {modal.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-lg text-gray-600 hover:text-gray-900"
                    aria-label="Close"
                  >
                    ✖
                  </button>
                </div>

                <IframeModal modal={modal} closeModal={closeModal} />
              </div>
            </div>
          )}
        </div>
      </DndContext>
    </Provider>
  );
};

export default App;

