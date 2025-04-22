import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import LabReportsTable from "../../molecules/LabReportsTable/LabReportsTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchLabReports } from "../../../features/labResults/labResultsThunk";
import Icons from "../../../assets/Icons/Icons";

interface LabReportsCardProps {
  patientId: string | null;
}

const LabReportsCard: React.FC<LabReportsCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { labReports, loading, error } = useAppSelector(
    (state) => state.labReports
  );

  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All", count: labReports.length },
    {
      label: "Abnormal",
      count: labReports.filter((r) => r.abnormal !== "normal").length,
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-500 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Unable to Load Lab Reports
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleFetchLabReports}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            Retry
          </div>
        </button>
      </div>
    );
  }

  // Check for empty lab reports
  if (!labReports || labReports.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-500 bg-blue-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          No Lab Reports Available
        </h3>
        <p className="text-sm text-gray-600">
          No laboratory reports are available for this patient.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        <LabReportsTable
          labReports={labReports}
          loading={false}
          tableHeaders={tableHeaders}
        />
      </div>
    </div>
  );
};

export default LabReportsCard;