import React, { useEffect, useState, useMemo } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { DiagnosisTable } from "../../molecules/DiagnosisTable/DiagnosisTable";
import { getDiagnosisDataFromApi } from "../../../api/patientData";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface DiagnosisUser {
  id: number;
  fname: string;
  mname: string;
  lname: string;
}

interface Diagnosis {
  id: number;
  title: string;
  begdate: string;
  enddate?: string;
  outcome: number;
  diagnosis: string;
  primary_diagnosis_code: number;
  modified_by: string;
  modified_on: string;
  provider: DiagnosisUser | null;
}

interface MedicalProblemsListProps {
  patientId?: string | null;
  isAnyModalOpen?: boolean;
}

const MedicalProblemsList: React.FC<MedicalProblemsListProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleFetchDiagnosis = async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getDiagnosisDataFromApi(patientId);
      setDiagnosis(response.data || response); // Handle both response.data and direct response
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchDiagnosis();
  }, [patientId]);

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
        message={error}
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