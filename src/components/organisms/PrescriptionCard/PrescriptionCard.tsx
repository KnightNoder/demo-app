import React, { useEffect, useState } from "react";
import PrescriptionItem from "../../molecules/PrescriptionItem/PrescriptionItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";

interface Prescription {
  id: number;
  drug_display: string;
  dosage: string;
  form: string;
  route: string;
  interval: string;
  doseother: string;
  note: string;
  quantity: string;
  quantityunit: string;
  active: number;
  ndcid: string;
  refills: number;
  start_date: string;
  provider: {
    id: number;
    name: string;
  };
}

const PrescriptionCard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Active");
  

  useEffect(() => {
    const fetchPrescriptions = async () => {
      // Simulated API data
      setPrescriptions([
        {
          id: 5,
          drug_display: "psyllium husk (Reguloid (psyllium husk)) capsule",
          dosage: "1",
          form: "capsule",
          route: "tablet,delayed release (DR/EC)",
          interval: "once a day",
          doseother: "as needed",
          note: "after gym and walk",
          quantity: "5",
          quantityunit: "capsule",
          active: 1,
          ndcid: "80681002200",
          refills: 0,
          start_date: "2023-10-02",
          provider: {
            id: 1,
            name: "Ensoftek Administrator"
          }
        }
      ]);
      setLoading(false); // <-- Set loading to false after data is set
    };
  
    fetchPrescriptions();
  }, []);
  

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  const tabs = [
    { label: "Active", count: 3  },
    { label: "High Risk", count: 0 },
    { label: "Needs Review", count: 0 },
    { label: "All", count: 3 },
  ];
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      {prescriptions.length > 0 ? (
        prescriptions.map((prescription) => (
          <PrescriptionItem key={prescription.id} prescription={prescription} />
        ))
      ) : (
        <p className="text-center text-gray-500">No prescriptions available.</p>
      )}
    </div>
  );
};

export default PrescriptionCard;
