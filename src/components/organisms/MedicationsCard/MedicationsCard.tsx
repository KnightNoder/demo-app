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
  const { medications, loading, error } = useAppSelector((state) => state.medications);

  const [activeTab, setActiveTab] = useState("Active");

  const tabs = [
    { label: "Active", count: medications.length },
    { label: "OTC", count: 2 },
  ];

  useEffect(() => {
    if (patientId) {
      dispatch(fetchMedications(patientId));
    }
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
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
          <p className="text-lg font-semibold text-red-500">Oops! Something went wrong.</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4 space-y-4">
        {medications
          .filter((med) => (activeTab === "Active" ? med.isActive : !med.isActive))
          .map((med, index: number) => (
            <MedicationItem key={index} medication={med} />
          ))}
      </div>
    </div>
  );
};

export default MedicationsCard;