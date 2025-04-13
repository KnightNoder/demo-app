import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

interface FunctionalStatusCardComponentProps {
  patientId: null | string;
  isAnyModalOpen?: boolean;
}

interface FunctionalStatusCardProps {
  title: string;
  description?: string;
  comments: string;
  begdate: string;
  enddate: string;
  reported_by_patient: boolean;
}

interface FunctionalStatusData {
  title: string;
  description?: string;
  comments: string;
  begdate: string;
  enddate: string;
  reported_by_patient: boolean;
}

const FunctionalStatusCard: React.FC<FunctionalStatusCardProps> = ({
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
        <a href="#" className="font-normal  text-primary">
          {title}
        </a>
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>
      {description && (
        <p className="mt-1 text-gray-700">{description || "N/A"}</p>
      )}
      <p className="mt-2 text-sm  text-[#020817]">Comments: {comments}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">Begin: {begdate}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">End: {enddate}</p>
      <p className="mt-2 text-xs font-light text-[#020817]">
        Reported by Patient: {reported_by_patient ? "Yes" : "No"}
      </p>
    </div>
  );
};

// p-4 rounded-lg border border-gray-200 bg-white
const FunctionalStatusList: React.FC<FunctionalStatusCardComponentProps> = ({
  patientId,
}) => {
  const [functionalStatusData, setFunctionalStatusData] = useState<
    FunctionalStatusData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    if (patientId) {
      fetchFunctionalStatus();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="text-center py-4">Loading functional status data...</div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (functionalStatusData.length === 0) {
    return (
      <div className="text-center py-4">
        No functional status data available.
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
