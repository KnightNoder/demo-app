import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { formatDate } from "../../../utils/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface AssessmentListProps {
  patientId: null | string;
  isAnyModalOpen?: boolean;
}

interface AssessmentCardComponentProps2 {
  id: number;
  pid: number;
  title: string;
  begdate: string;
  enddate: string | null;
  comments: string;
  reported_by_patient: boolean;
  type: "cognitive_status";
  score?: string;
  isAnyModalOpen?: boolean;
}

const AssessmentCard: React.FC<AssessmentCardComponentProps2> = ({
  title,
  begdate,
  enddate,
  comments,
  reported_by_patient,
  score,
  isAnyModalOpen,
}) => {
  // Explicit boolean check to handle undefined case properly
  const isModalOpen = isAnyModalOpen === true;

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3
            className={`text-blue-600 font-light text-base ${isModalOpen ? "max-w-[400px]" : "max-w-[100px] truncate"} font-feature-settings-[var(--font-feature-settings-rlig)] font-feature-settings-[var(--font-feature-settings-ligature)]`}
          >
            {title}
          </h3>
          <span className="ml-2 text-xs font-light text-gray-600">
            Score: {score || "N/A"}
          </span>
        </div>
        <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>

      <p className="text-gray-600 text-sm mt-1 font-light">{title}</p>

      <div className="text-xs text-gray-600 mt-1 font-light">
        Type: Cognitive Screening
      </div>

      <div className="mt-2 flex gap-1">
        <div className="text-gray-600 text-xs font-light">Comments: </div>
        <div className="text-gray-800 text-xs font-light">
          {comments || " N/A"}
        </div>
      </div>

      <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-600 font-light">
          <div>Begin: {formatDate(begdate)}</div>
          <div className="mt-2">Enc: N/A</div>
        </div>
        <div className="text-xs text-gray-500 text-right font-light">
          <div>End: {enddate || "N/A"}</div>
          <div className="mt-2">
            Reported by Client: {reported_by_patient ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssessmentList: React.FC<AssessmentListProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const [assessments, setAssessments] = useState<
    AssessmentCardComponentProps2[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = () => {
    if (patientId) {
      setLoading(true);
      setError(null);
      axiosClient
        .get(`/cognitive-status?pid=${patientId}`)
        .then((resp) => {
          setAssessments(resp.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(
            error.response?.data?.message ||
              "Failed to load assessments. Please try again later."
          );
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <Skeleton height={30} width="50%" className="mb-4" />
        <div className="space-y-4">
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-red-500 bg-red-100 rounded-full">
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
            Unable to Load Assessments
          </h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchAssessments}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </div>
        </button>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 bg-white rounded-lg border border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="font-medium">No assessments found for this patient.</p>
        <p className="mt-1 text-sm">
          Any cognitive screenings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-3 md:space-y-4">
      {assessments.map((item, index) => (
        <AssessmentCard
          key={`${item.id}-${index}`}
          {...item}
          isAnyModalOpen={isAnyModalOpen}
        />
      ))}
    </div>
  );
};

export default AssessmentList;