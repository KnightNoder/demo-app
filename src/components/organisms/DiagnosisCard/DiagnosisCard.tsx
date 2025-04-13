import React, { useEffect, useState, useMemo } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { DiagnosisTable } from "../../molecules/DiagnosisTable/DiagnosisTable";
import { fetchDiagnosis } from "../../../features/diagnosisSlice/diagnosisThunk";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface MedicalProblemsListProps {
  patientId?: string | null;
  isAnyModalOpen?: boolean;
}

const MedicalProblemsList: React.FC<MedicalProblemsListProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const dispatch = useAppDispatch();
  const { diagnosis, loading, error } = useAppSelector(
    (state) => state.diagnosis
  );

  const [activeTab, setActiveTab] = useState("Active");

  // Filter diagnoses based on the active tab
  const filteredDiagnosis = useMemo(() => {
    if (!diagnosis) return [];

    const now = new Date();

    switch (activeTab) {
      case "Active":
        // Show diagnoses whose modified_on is less than now
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate < now;
        });
      case "Resolved":
        // Show diagnoses whose modified_on is greater than now
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate > now;
        });
      case "All":
      default:
        // Show all diagnoses
        return diagnosis;
    }
  }, [diagnosis, activeTab]);

  // Update the tabs to show the correct counts
  const tabs = useMemo(() => {
    if (!diagnosis) return [];

    const now = new Date();

    const activeDiagnoses = diagnosis.filter((item) => {
      const modifiedDate = new Date(item.modified_on);
      return modifiedDate < now;
    });

    const resolvedDiagnoses = diagnosis.filter((item) => {
      const modifiedDate = new Date(item.modified_on);
      return modifiedDate > now;
    });

    return [
      { label: "Active", count: activeDiagnoses.length },
      { label: "Resolved", count: resolvedDiagnoses.length },
      { label: "All", count: diagnosis.length },
    ];
  }, [diagnosis]);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchDiagnosis(patientId));
    }
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="p-4 mx-auto bg-white rounded-lg">
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
      <div className="flex flex-col items-center justify-center p-4 mx-auto bg-white rounded-lg">
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

  return (
    <div className="pb-4 mx-auto bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        <DiagnosisTable
          diagnosis={filteredDiagnosis}
          isAnyModalOpen={isAnyModalOpen}
        />
      </div>
    </div>
  );
};

export default MedicalProblemsList;
