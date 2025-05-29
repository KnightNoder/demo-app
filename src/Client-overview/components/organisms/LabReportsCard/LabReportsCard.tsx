import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import LabReportsTable from "../../molecules/LabReportsTable/LabReportsTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchLabReports } from "../../../../features/labResults/labResultsThunk";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface LabReportsCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const LabReportsCard: React.FC<LabReportsCardProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const dispatch = useAppDispatch();
  const { labReports, loading, error } = useAppSelector(
    (state) => state.labReports
  );

  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All", count: labReports?.length },
    {
      label: "Abnormal",
      count: labReports?.filter((r) => r.abnormal !== "normal").length,
    },
  ];

  const tableHeaders = [
    "Test",
    "Result",
    "Range",
    "Status",
    "Ordered",
    "Reported",
  ];

  const handleFetchLabReports = () => {
    if (patientId) {
      dispatch(fetchLabReports(patientId));
    }
  };

  useEffect(() => {
    handleFetchLabReports();
  }, [dispatch, patientId]);

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

  if (labReports.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <div className="h-full">
          <EmptyStateComponent
            title="No Lab Reports Available"
            message="No laboratory reports are available for this patient."
            isAnyModalOpen={isAnyModalOpen}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Unable to Load Lab Reports"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={handleFetchLabReports}
      />
    );
  }

  if (!Array.isArray(labReports)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of lab reports but received a different format."
        icon="warning"
        onRetry={handleFetchLabReports}
      />
    );
  }

  const filteredReports =
    activeTab === "All"
      ? labReports
      : labReports.filter((report) => report.abnormal !== "normal");

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        <LabReportsTable
          labReports={filteredReports}
          loading={false}
          tableHeaders={tableHeaders}
        />
      </div>
    </div>
  );
};

export default LabReportsCard;