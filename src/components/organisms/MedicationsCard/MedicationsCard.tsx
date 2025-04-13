import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import MedicationItem from "../../molecules/MedicationItem/MedicationItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMedications } from "../../../features/medications/medicationsThunk";

interface MedicationsCardProps {
  patientId: string | null;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { medications, loading, error } = useAppSelector(
    (state) => state.medications
  );

  const [activeTab, setActiveTab] = useState("Active");

  // Filter medications based on refill value

  const activeMedications = medications.filter((med) => med.refill === "0");
  const otcMedications = medications.filter((med) => med.refill !== "0");

  const tabs = [
    { label: "Active", count: activeMedications.length },
    { label: "OTC", count: otcMedications.length },
  ];

  useEffect(() => {
    if (patientId) {
      dispatch(fetchMedications(patientId));
    }
  }, [dispatch, patientId]);

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
          <p className="text-lg font-semibold text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

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
          <div className="w-full p-4 text-center text-gray-500">
            No Medications found
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsCard;