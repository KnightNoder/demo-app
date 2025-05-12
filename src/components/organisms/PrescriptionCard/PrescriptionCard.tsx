import React, { useEffect, useState } from "react";
import PrescriptionItem from "../../molecules/PrescriptionItem/PrescriptionItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosClient from "../../../api/axiosClient";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface PrescriptionCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
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

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/prescriptions/${patientId}/`);
      setPrescriptions(response.data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <ErrorComponent
        title="Unable to Load Prescriptions"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchPrescriptions}
      />
    );
  }

  if (!Array.isArray(prescriptions)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of prescriptions but received a different format."
        icon="warning"
        onRetry={fetchPrescriptions}
      />
    );
  }

  const activeCount = prescriptions?.filter(
    (prescription) => prescription.active === 1
  ).length;

  const tabs = [
    { label: "Active", count: activeCount },
    { label: "High Risk", count: 0 },
    { label: "Needs Review", count: 0 },
    { label: "All", count: prescriptions?.length },
  ];

  const filteredPrescriptions =
    activeTab === "All"
      ? prescriptions
      : activeTab === "Active"
        ? prescriptions?.filter((prescription) => prescription.active === 1)
        : [];

  if (filteredPrescriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-y-auto relative">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <EmptyStateComponent
          title="No Prescriptions Found"
          message={
            activeTab === "All"
              ? "No prescriptions are available for this patient."
              : `No ${activeTab.toLowerCase()} prescriptions are available for this patient.`
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-y-auto relative">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4 space-y-4">
        {filteredPrescriptions?.map((prescription) => (
          <PrescriptionItem key={prescription.id} prescription={prescription} />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCard;