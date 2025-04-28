import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import MedicationItem from "../../molecules/MedicationItem/MedicationItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMedications } from "../../../features/medications/medicationsThunk";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface MedicationsCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { medications, loading, error } = useAppSelector(
    (state) => state.medications
  );

  const [activeTab, setActiveTab] = useState("Active");

  const handleFetchMedications = () => {
    if (patientId) {
      dispatch(fetchMedications(patientId));
    }
  };

  useEffect(() => {
    handleFetchMedications();
  }, [dispatch, patientId]);

  // Filtering logic moved after array validation
  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
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
        title="Unable to Load Medications"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={handleFetchMedications}
      />
    );
  }

  if (!Array.isArray(medications)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of medications but received a different format."
        icon="warning"
        onRetry={handleFetchMedications}
      />
    );
  }

  // Filter medications based on refill value
  const activeMedications = medications.filter((med) => med.refill === "0");
  const otcMedications = medications.filter((med) => med.refill !== "0");

  const tabs = [
    { label: "Active", count: activeMedications.length },
    { label: "OTC", count: otcMedications.length },
  ];

  // Determine which medications to display based on active tab
  const filteredMedications =
    activeTab === "Active" ? activeMedications : otcMedications;

  return (
    <div className="bg-white rounded-lg overflow-y-auto relative">
      <div className="sticky top-0 z-20 bg-white">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
      <div className="mt-4 space-y-4 overflow-y-auto">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med, index) => (
            <MedicationItem key={index} medication={med} />
          ))
        ) : (
          <EmptyStateComponent
            title="No Medications Found"
            message={
              activeTab === "Active"
                ? "No active medications are available for this patient."
                : "No over-the-counter medications are available for this patient."
            }
          />
        )}
      </div>
    </div>
  );
};

export default MedicationsCard;