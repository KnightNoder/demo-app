import { useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";

interface Medication {
  name: string;
  dosage: string;
  form: string;
  frequency: string;
  doctor: string;
  prescribedTime: string;
  refillsRemaining: number;
  isActive: boolean;
}

const medications: Medication[] = [
  {
    name: "Lisinopril",
    dosage: "10mg",
    form: "Oral",
    frequency: "Once daily",
    doctor: "Dr. Sarah Chen",
    prescribedTime: "about 1 year ago",
    refillsRemaining: 3,
    isActive: true,
  },
  {
    name: "Metformin",
    dosage: "500mg",
    form: "Oral",
    frequency: "Twice daily",
    doctor: "Dr. James Wilson",
    prescribedTime: "about 1 year ago",
    refillsRemaining: 2,
    isActive: true,
  },
];

const tabs = [
  { label: "Active", count: medications.length },
  { label: "OTC", count: 2 },
];

const MedicationCard: React.FC<{ medication: Medication }> = ({ medication }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-md rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{medication.name}</h2>
        {medication.isActive && (
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">active</span>
        )}
      </div>
      <p className="text-sm text-gray-500">{medication.dosage} · {medication.form}</p>
      <div className="mt-2">
        <p className="flex items-center gap-2 text-sm">⏳ {medication.frequency}</p>
        <p className="flex items-center gap-2 text-sm">👨‍⚕️ {medication.doctor}</p>
        <p className="flex items-center gap-2 text-sm">📅 Prescribed {medication.prescribedTime}</p>
      </div>
      <div className="p-2 mt-3 text-xs text-gray-600 bg-gray-100 rounded-md w-fit">
        {medication.refillsRemaining} refills remaining
      </div>
    </div>
  );
};

const MedicationList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Active"); // Default to 'Active'

  return (
    <div className="px-10 mx-auto">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="space-y-4">
        {medications
          .filter((med) => (activeTab === "Active" ? med.isActive : !med.isActive))
          .map((med, index) => (
            <MedicationCard key={index} medication={med} />
          ))}
      </div>
    </div>
  );
};

export default MedicationList;
