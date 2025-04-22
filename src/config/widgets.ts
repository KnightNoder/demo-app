import DiagnosisCard from "../components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "../components/organisms/AllergiesCard/AllergiesCard";
import MedicationsCard from "../components/organisms/MedicationsCard/MedicationsCard";
// import ClinicalNotesCard from "../components/organisms/ClinicalNotesCard/ClinicalNotesCard";
import InsuranceCard from "../components/organisms/InsuranceCard/InsuranceCard";
import LabReportsCard from "../components/organisms/LabReportsCard/LabReportsCard";
import DocumentsCard from "../components/organisms/DocumentsCard/DocumentsCard";
import PrescriptionCard from "../components/organisms/PrescriptionCard/PrescriptionCard";
import AppointmentsCard from "../components/organisms/AppointmentsCard/AppointmentsCard";
import NotificationCard from "../components/organisms/NotificationsCard/NotificationsCard";
import DemographicsCard from "../components/organisms/Demographics/Demographics";
import PhotosCard from "../components/organisms/PhotosCard/PhotosCard";
import VitalsCard from "../components/organisms/VitalsCard/VitalsCard";
import DisclosuresCard from "../components/organisms/DisclosuresCard/DisclosuresCard";
import FunctionalStatusCard from "../components/organisms/FunctionalStatusCard/FunctionalStatusCard";
import CognitiveStatusCard from "../components/organisms/CognitiveStatusCard/CognitiveStatusCard";
// import AdvancedDirectivesCard from "../components/organisms/AdvancedDirectivesCard/AdvancedDirectivesCard";

// Define widget option types
export interface WidgetOption {
  key: string;
  component: React.ComponentType<any>;
  icon: string;
  iconBgColor: string;
  hasWritePermission: boolean;
}

// Widget options configuration
export const widgetOptions: WidgetOption[] = [
  {
    key: "Allergies",
    component: AllergyCard,
    icon: "allergies",
    iconBgColor: "bg-rose-100",
    hasWritePermission: true,
  },
  {
    key: "Diagnosis",
    component: DiagnosisCard,
    icon: "diagnosis",
    iconBgColor: "bg-indigo-100",
    hasWritePermission: true,
  },
  {
    key: "Medications",
    component: MedicationsCard,
    icon: "medications",
    iconBgColor: "bg-orange-100",
    hasWritePermission: true,
  },
  // {
  //   key: "Clinical Notes",
  //   component: ClinicalNotesCard,
  //   icon: "clinicalNotes",
  //   iconBgColor: "bg-emerald-100",
  //   hasWritePermission: true,
  // },
  {
    key: "Insurance",
    component: InsuranceCard,
    iconBgColor: "bg-blue-100",
    icon: "insurance",
    hasWritePermission: true,
  },
  {
    key: "Lab Reports",
    component: LabReportsCard,
    iconBgColor: "bg-blue-100",
    icon: "lab-results",
    hasWritePermission: true,
  },
  {
    key: "Prescriptions",
    component: PrescriptionCard,
    iconBgColor: "bg-orange-100",
    icon: "prescriptions",
    hasWritePermission: true,
  },
  {
    key: "Documents",
    component: DocumentsCard,
    iconBgColor: "bg-orange-100",
    icon: "document",
    hasWritePermission: true,
  },
  {
    key: "Appointments",
    component: AppointmentsCard,
    iconBgColor: "bg-violet-100",
    icon: "appointments",
    hasWritePermission: true,
  },
  {
    key: "Notifications",
    component: NotificationCard,
    iconBgColor: "bg-amber-100",
    icon: "notifications",
    hasWritePermission: true,
  },
  {
    key: "Demographics",
    component: DemographicsCard,
    iconBgColor: "bg-green-100",
    icon: "demographics",
    hasWritePermission: true,
  },
  {
    key: "ID Card/Photos",
    component: PhotosCard,
    iconBgColor: "bg-purple-100",
    icon: "id-card",
    hasWritePermission: true,
  },
  {
    key: "Vitals",
    component: VitalsCard,
    iconBgColor: "bg-red-100",
    icon: "vitals",
    hasWritePermission: true,
  },
  {
    key: "Disclosures",
    component: DisclosuresCard,
    iconBgColor: "bg-teal-100",
    icon: "disclosures",
    hasWritePermission: true,
  },
  {
    key: "Functional Status",
    component: FunctionalStatusCard,
    iconBgColor: "bg-slate-100",
    icon: "functional-status",
    hasWritePermission: true,
  },
  {
    key: "Cognitive Status",
    component: CognitiveStatusCard,
    iconBgColor: "bg-slate-100",
    icon: "cognitive-status",
    hasWritePermission: true,
  },
  // {
  //   key: "Advanced Directives",
  //   component: AdvancedDirectivesCard,
  //   iconBgColor: "bg-purple-100",
  //   icon: "advanced-directives",
  //   hasWritePermission: true,
  // },
];

// Default visible widgets
export const defaultVisibleWidgets: string[] = [
  "Diagnosis",
  "Prescriptions",
  "Cognitive Status",
  "Functional Status",
  "Medications",
  "Notifications",
  // "Advanced Directives",
  "Appointments",
  // "Clinical Notes",
];