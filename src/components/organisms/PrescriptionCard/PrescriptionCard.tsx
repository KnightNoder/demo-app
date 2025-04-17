import React, { useEffect, useState } from "react";
import PrescriptionItem from "../../molecules/PrescriptionItem/PrescriptionItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Skeleton from "react-loading-skeleton";
import axiosClient from "../../../api/axiosClient";

interface PrescriptionCardProps {
  patientId: string | null;
}

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

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Active");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axiosClient.get(`/prescriptions/${patientId}/`);
        setPrescriptions(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="flex flex-col items-center mb-4">
          <Skeleton circle height={40} width={40} />
          <div className="mt-4">
            <Skeleton height={30} width={200} />
          </div>
          <div className="mt-2">
            <Skeleton height={20} width={250} />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-normal text-[#020817]">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-xs font-light text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  if (!Array.isArray(prescriptions)) {
    return (
      <div className="w-full p-4 text-center text-xs font-light text-gray-600">
        Error: Expected an array of prescriptions.
      </div>
    );
  }

  const activeCount = prescriptions.filter(
    (prescription) => prescription.active === 1
  ).length;

  const tabs = [
    { label: "Active", count: activeCount },
    { label: "High Risk", count: 0 },
    { label: "Needs Review", count: 0 },
    { label: "All", count: prescriptions.length },
  ];

  const filteredPrescriptions =
    activeTab === "All"
      ? prescriptions
      : activeTab === "Active"
        ? prescriptions.filter((prescription) => prescription.active === 1)
        : [];

  return (
    <div className="bg-white rounded-lg overflow-y-auto relative">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      {filteredPrescriptions.length > 0 ? (
        filteredPrescriptions.map((prescription) => (
          <PrescriptionItem key={prescription.id} prescription={prescription} />
        ))
      ) : (
        <div className="w-full h-[320px] p-4 text-center text-xs font-light text-gray-600">
          No Prescriptions found
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;