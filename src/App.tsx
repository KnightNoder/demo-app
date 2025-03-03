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

const widgetOptions = [
  {
    key: "Allergies",
    component: AllergyCard,
    position: { x: 100, y: 100 },
    icon: "allergies",
  },
  {
    key: "Diagnosis",
    component: DiagnosisCard,
    position: { x: 950, y: 100 },
    icon: "diagnosis",
  },
  {
    key: "Medications",
    component: MedicationsCard,
    position: { x: 100, y: 650 },
    icon: "medications",
  },
  {
    key: "Clinical Notes",
    component: ClinicalNotesCard,
    position: { x: 950, y: 650 },
    icon: "clinicalNotes",
  },
  {
    key: "Insurance",
    component: InsuranceCard,
    position: { x: 100, y: 1250 },
    icon: "insurance",
  },
  {
    key: "Lab Reports",
    component: LabReportsCard,
    position: { x: 950, y: 1250 },
    icon: "insurance",
  },
  {
    key: "Prescriptions",
    component: PrescriptionCard,
    position: { x: 100, y: 1850 },
    icon: "insurance",
  },
  {
    key: "Documents",
    component: DocumentsCard,
    position: { x: 950, y: 1850 },
    icon: "insurance",
  },
  {
    key: "Appointments",
    component: AppointmentsCard,
    position: { x: 100, y: 2450 },
    icon: "insurance",
  },
  {
    key: "Notifications",
    component: NotificationCard,
    position: { x: 950, y: 2450 },
    icon: "insurance",
  },
  {
    key: "Demographics",
    component: DemographicsCard,
    position: { x: 100, y: 2950 },
    icon: "insurance",
  },
];

const App: React.FC = () => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

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
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
      <div className="relative h-[300vh] w-[50vw]">
        <div className="relative h-[230vh] w-[50vw]">
          <div
            className="fixed z-50 transform -translate-x-1/2 top-10 left-1/2"
            ref={widgetRef}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center p-2 space-x-2 transition bg-white rounded-md shadow-md hover:bg-gray-200"
            >
              <Icons variant="widgets" />
              <span>Widgets</span>
            </button>

            <div
              className={`absolute top-full left-0 mt-2 p-4 w-[500px] bg-white rounded-md shadow-lg transition-transform duration-300 ${
                isOpen
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
              >
                {widget.component && <widget.component patientId={patientId} />}
              </Card>
            ))}
        </div>
      </div>
    </Provider>
  );
};

export default App;
