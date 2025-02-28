import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import LabReportsTable from "../../molecules/LabReportsTable/LabReportsTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchLabReports } from "../../../features/labResults/labResultsThunk";

interface LabReportsCardProps {
  patientId: string | null;
}

const LabReportsCard: React.FC<LabReportsCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { labReports, loading, error } = useAppSelector(
    (state) => state.labReports
  );

  const [activeTab, setActiveTab] = useState("Recent");

  const tabs = [
    { label: "Recent", count: labReports.length },
    {
      label: "Pending",
      count: labReports.filter((r) => r.status !== "normal").length,
    },
    {
      label: "Completed",
      count: labReports.filter((r) => r.status === "normal").length,
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

  useEffect(() => {
    if (patientId) {
      dispatch(fetchLabReports(patientId));
    }
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
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
        <div className="text-lg font-semibold text-red-500">
          Oops! Something went wrong.
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
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
