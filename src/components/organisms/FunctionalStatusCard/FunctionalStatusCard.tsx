import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Icons from "../../../assets/Icons/Icons";

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
            Unable to Load Functional Status
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchFunctionalStatus}
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

  if (functionalStatusData.length === 0) {
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
          No Data Available
        </h3>
        <p className="text-sm text-gray-600">
          No functional status information is available for this patient.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-4">
      {functionalStatusData.map((item, index) => (
        <FunctionalStatusCard key={index} {...item} />
      ))}
    </div>
  );
};

export default FunctionalStatusList;