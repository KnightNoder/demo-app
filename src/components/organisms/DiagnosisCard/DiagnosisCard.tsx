import React, { useEffect, useState, useMemo } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { DiagnosisTable } from "../../molecules/DiagnosisTable/DiagnosisTable";
import { fetchDiagnosis } from "../../../features/diagnosisSlice/diagnosisThunk";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

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

  const filteredDiagnosis = useMemo(() => {
    if (!Array.isArray(diagnosis)) return [];

    const now = new Date();

    switch (activeTab) {
      case "Active":
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate < now;
        });
      case "Resolved":
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate > now;
        });
      case "All":
      default:
        return diagnosis;
    }
  }, [diagnosis, activeTab]);

  const tabs = useMemo(() => {
    if (!Array.isArray(diagnosis) || diagnosis.length === 0) {
      return [
        { label: "Active", count: 0 },
        { label: "Resolved", count: 0 },
        { label: "All", count: 0 },
      ];
    }

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

  const handleFetchDiagnosis = () => {
    if (patientId) {
      dispatch(fetchDiagnosis(patientId));
    }
  };

  useEffect(() => {
    handleFetchDiagnosis();
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
      <ErrorComponent
        title="Unable to Load Medical Problems"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={handleFetchDiagnosis}
      />
    );
  }

  if (!Array.isArray(diagnosis)) {
    return (
      <EmptyStateComponent
        title="No Medical Problems Found"
        message={
          activeTab === "All"
            ? "No medical problems are available for this patient."
            : `No ${activeTab.toLowerCase()} medical problems are available for this patient.`
        }
      />
    );
  }

  if (filteredDiagnosis.length === 0) {
    return (
      <div className="pb-4 mx-auto bg-white rounded-lg overflow-y-auto relative">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <EmptyStateComponent
          title="No Medical Problems Found"
          message={
            activeTab === "All"
              ? "No medical problems are available for this patient."
              : `No ${activeTab.toLowerCase()} medical problems are available for this patient.`
          }
        />
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
