import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import Icons from "../../../assets/Icons/Icons";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface FunctionalStatusCardComponentProps {
  patientId: null | string;
  isAnyModalOpen?: boolean;
}

interface FunctionalStatusData {
  title: string;
  description?: string;
  comments: string;
  begdate: string;
  enddate: string;
  reported_by_patient: boolean;
}

const FunctionalStatusCard: React.FC<FunctionalStatusData> = ({
  title,
  description,
  comments,
  begdate,
  enddate,
  reported_by_patient,
}) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between text-sm font-normal">
        <a href="#" className="font-normal text-primary">
          {title}
        </a>
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>
      {description && (
        <p className="mt-1 text-gray-700">{description || "N/A"}</p>
      )}
      <p className="mt-2 text-sm text-[#020817]">Comments: {comments}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">Begin: {begdate}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">End: {enddate}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">
        Reported by Patient: {reported_by_patient ? "Yes" : "No"}
      </p>
    </div>
  );
};

const FunctionalStatusList: React.FC<FunctionalStatusCardComponentProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const [functionalStatusData, setFunctionalStatusData] = useState<
    FunctionalStatusData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunctionalStatus = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/functional-status?pid=${patientId}`
      );
      setFunctionalStatusData(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching functional status data:", err);
      setError(
        "Failed to load functional status data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchFunctionalStatus();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Unable to Load Functional Status"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchFunctionalStatus}
      />
    );
  }

  if (!Array.isArray(functionalStatusData)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of functional status items but received a different format."
        icon="warning"
        onRetry={fetchFunctionalStatus}
      />
    );
  }

  if (functionalStatusData.length === 0) {
    return (
      <EmptyStateComponent
        title="No Functional Status Data Available"
        message="No functional status information is available for this patient."
        isAnyModalOpen={isAnyModalOpen}
      />
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-4">
      {functionalStatusData?.map((item, index) => (
        <FunctionalStatusCard key={index} {...item} />
      ))}
    </div>
  );
};

export default FunctionalStatusList;