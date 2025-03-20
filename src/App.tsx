import React, { useEffect, useState, useRef } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "./components/organisms/AllergiesCard/AllergiesCard";
import MedicationsCard from "./components/organisms/MedicationsCard/MedicationsCard";
import ClinicalNotesCard from "./components/organisms/ClinicalNotesCard/ClinicalNotesCard";
import InsuranceCard from "./components/organisms/InsuranceCard/InsuranceCard";
import LabReportsCard from "./components/organisms/LabReportsCard/LabReportsCard";
import Icons from "./assets/Icons/Icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import DocumentsCard from "./components/organisms/DocumentsCard/DocumentsCard";
import PrescriptionCard from "./components/organisms/PrescriptionCard/PrescriptionCard";
import AppointmentsCard from "./components/organisms/AppointmentsCard/AppointmentsCard";
import NotificationCard from "./components/organisms/NotificationsCard/NotificationsCard";
import DemographicsCard from "./components/organisms/Demographics/Demographics";
import PhotosCard from "./components/organisms/PhotosCard/PhotosCard";
import VitalsCard from "./components/organisms/VitalsCard/VitalsCard";
import IframeModal from "./components/molecules/Modal/IframeModal";
import DisclosuresCard from "./components/organisms/DisclosuresCard/DisclosuresCard";
import FunctionalStatusCard from "./components/organisms/FunctionalStatusCard/FunctionalStatusCard";
import CognitiveStatusCard from "./components/organisms/CognitiveStatusCard/CognitiveStatusCard";
import AdvancedDirectivesCard from "./components/organisms/AdvancedDirectivesCard/AdvancedDirectivesCard";

const widgetOptions = [
  {
    key: "Allergies",
    component: AllergyCard,
    position: { x: 10, y: 10 },
    icon: "allergies",
  },
  {
    key: "Diagnosis",
    component: DiagnosisCard,
    position: { x: 800, y: 10 },
    icon: "diagnosis",
  },
  {
    key: "Medications",
    component: MedicationsCard,
    position: { x: 10, y: 650 },
    icon: "medications",
  },
  {
    key: "Clinical Notes",
    component: ClinicalNotesCard,
    position: { x: 800, y: 650 },
    icon: "clinicalNotes",
  },
  {
    key: "Insurance",
    component: InsuranceCard,
    position: { x: 10, y: 1250 },
    icon: "insurance",
  },
  {
    key: "Lab Reports",
    component: LabReportsCard,
    position: { x: 800, y: 1250 },
    icon: "insurance",
  },
  {
    key: "Prescriptions",
    component: PrescriptionCard,
    position: { x: 10, y: 1850 },
    icon: "insurance",
  },
  {
    key: "Documents",
    component: DocumentsCard,
    position: { x: 800, y: 1850 },
    icon: "insurance",
  },
  {
    key: "Appointments",
    component: AppointmentsCard,
    position: { x: 10, y: 2450 },
    icon: "insurance",
  },
  {
    key: "Notifications",
    component: NotificationCard,
    position: { x: 800, y: 2450 },
    icon: "insurance",
  },
  {
    key: "Demographics",
    component: DemographicsCard,
    position: { x: 10, y: 3050 },
    icon: "insurance",
  },
  {
    key: "ID/Card Photos",
    component: PhotosCard,
    position: { x: 800, y: 3050 },
    icon: "insurance",
  },
  {
    key: "Vitals",
    component: VitalsCard,
    position: { x: 10, y: 3650 },
    icon: "insurance",
  },
  {
    key: "Disclosures",
    component: DisclosuresCard,
    position: { x: 800, y: 3650 },
    icon: "insurance",
  },
  {
    key: "Functional Status",
    component: FunctionalStatusCard,
    position: { x: 10, y: 4250 },
    icon: "insurance",
  },
  {
    key: "Cognitive Status",
    component: CognitiveStatusCard,
    position: { x: 800, y: 4250 },
    icon: "insurance",
  },
  {
    key: "Advanced Directives",
    component: AdvancedDirectivesCard,
    position: { x: 10, y: 4850 },
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
    "Appointments",
    "Notifications",
    "Demographics",
    "ID/Card Photos",
    "Vitals",
    "Disclosures",
    "Functional Status",
    "Cognitive Status",
    "Advanced Directives",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // State for the modal
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    url: "",
    title: "",
  });

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
      return isAdding
        ? [...prevWidgets, widgetKey]
        : prevWidgets.filter((w) => w !== widgetKey);
    });
  };

  return (
    <Provider store={store}>
      <ToastContainer />
      <div className="relative h-[600vh] w-[50vw]">
        <div className="relative mt-24 h-[400vh] w-[50vw]">
          <div
            className="fixed z-50 transform -translate-x-1/6 top-10 left-2/5"
            ref={widgetRef}
          >
            <button
              onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
              className="absolute left-1/3 -translate-x-1/3 top-[-10px] flex items-center p-2 space-x-2 transition bg-white rounded-md shadow-md hover:bg-gray-200"
            >
              <Icons variant="widgets" />
              <span>Widgets</span>
            </button>

            <div
              className={`absolute top-full left-0 mt-2 p-4 w-[500px] bg-white rounded-md shadow-lg transition-transform duration-300 ${
                isWidgetMenuOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative flex items-center">
                <Icons variant="search" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search widgets..."
                  className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50"
                ></input>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="pb-1 mb-2 font-bold ">Add Widgets</h3>
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
          {widgetOptions
            .filter((widget) => visibleWidgets.includes(widget.key))
            .map((widget) => (
              <Card
                key={widget.key}
                title={widget.key}
                footer={true}
                category={widget.key}
                initialPosition={widget.position}
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
              >
                {widget.component && <widget.component patientId={patientId} />}
              </Card>
            ))}
        </div>

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
    </Provider>
  );
};

export default App;