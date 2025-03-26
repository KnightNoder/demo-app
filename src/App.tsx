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

// Define grid size for snapping
const GRID_SIZE = 20;
const GRID_COLUMNS = 2;
const CARD_WIDTH = 650;
const CARD_HEIGHT = 500;
const GRID_GAP = 20;

// Define the interface for grid items
interface GridItem {
  id: string;
  order: number;
}

const widgetOptions = [
  {
    key: "Allergies",
    component: AllergyCard,
    icon: "allergies",
  },
  {
    key: "Diagnosis",
    component: DiagnosisCard,
    icon: "diagnosis",
  },
  {
    key: "Medications",
    component: MedicationsCard,
    icon: "medications",
  },
  {
    key: "Clinical Notes",
    component: ClinicalNotesCard,
    icon: "clinicalNotes",
  },
  {
    key: "Insurance",
    component: InsuranceCard,
    icon: "insurance",
  },
  {
    key: "Lab Reports",
    component: LabReportsCard,
    icon: "insurance",
  },
  {
    key: "Prescriptions",
    component: PrescriptionCard,
    icon: "insurance",
  },
  {
    key: "Documents",
    component: DocumentsCard,
    icon: "insurance",
  },
  {
    key: "Appointments",
    component: AppointmentsCard,
    icon: "insurance",
  },
  {
    key: "Notifications",
    component: NotificationCard,
    icon: "insurance",
  },
  {
    key: "Demographics",
    component: DemographicsCard,
    icon: "insurance",
  },
  {
    key: "ID/Card Photos",
    component: PhotosCard,
    icon: "insurance",
  },
  {
    key: "Vitals",
    component: VitalsCard,
    icon: "insurance",
  },
  {
    key: "Disclosures",
    component: DisclosuresCard,
    icon: "insurance",
  },
  {
    key: "Functional Status",
    component: FunctionalStatusCard,
    icon: "insurance",
  },
  {
    key: "Cognitive Status",
    component: CognitiveStatusCard,
    icon: "insurance",
  },
  {
    key: "Advanced Directives",
    component: AdvancedDirectivesCard,
    icon: "insurance",
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

  // State for active dragging widget
  const [activeDragWidget, setActiveDragWidget] = useState<string | null>(null);

  // State for grid items
  const [gridItems, setGridItems] = useState<GridItem[]>([]);

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

  return (
    <Provider store={store}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ToastContainer />
        <div className="relative w-full min-h-screen mt-24">
          <div className="relative w-full">
            {/* Widget menu button */}
            <div
              className="fixed transform z-110 -translate-x-1/4 top-10 left-2/5"
              ref={widgetRef}
            >
              <button
                onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
                className="absolute left-1/3 -translate-x-1/3 top-[-10px] flex items-center p-2 space-x-2 transition bg-white rounded-md shadow-md hover:bg-gray-200"
              >
                <Icons variant="widgets" />
                <span>Widgets</span>
              </button>

              {/* Widget menu */}
              <div
                className={`absolute left-0 top-6 mt-2 p-4 w-[500px] bg-white rounded-md shadow-lg transition-transform duration-300 ${
                  isWidgetMenuOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
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

                {/* Widget grid */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* Add Widgets list */}
                  <div>
                    <h3 className="pb-1 mb-2 font-bold">Add Widgets</h3>
                    <ul className="mt-4 overflow-auto max-h-60">
                      {widgetOptions
                        .filter(
                          (w) =>
                            !visibleWidgets.includes(w.key) &&
                            w.key
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((widget) => (
                          <li
                            key={widget.key}
                            className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                          >
                            <span className="flex items-center space-x-2">
                              <Icons variant={widget.icon} />
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
                          const widget = widgetOptions.find(
                            (w) => w.key === key
                          );
                          return (
                            <li
                              key={key}
                              className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                            >
                              <span className="flex items-center space-x-2">
                                <Icons variant={widget?.icon || "default"} />
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
            ;{/* Grid Container */}
            <div className="container p-4 mx-auto">
              <div
                className="relative grid-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
                  gap: `${GRID_GAP}px`,
                  width: `calc(${GRID_COLUMNS} * ${CARD_WIDTH}px + ${(GRID_COLUMNS - 1) * GRID_GAP}px)`,
                  margin: "0 auto",
                }}
              >
                <SortableContext
                  items={gridItems}
                  strategy={rectSortingStrategy}
                >
                  {/* Render the cards */}
                  {gridItems.map((item) => {
                    const widget = widgetOptions.find((w) => w.key === item.id);
                    if (!widget) return null;

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
                      >
                        {widget.component && (
                          <widget.component patientId={patientId} />
                        )}
                      </Card>
                    );
                  })}
                </SortableContext>
              </div>
            </div>
            ;
          </div>

          {/* Modal */}
          {modal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-200 modal backdrop-blur-sm">
              <div className="relative bg-white p-4 rounded-lg shadow-lg w-[80%] h-[80%] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{modal.title}</h2>
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