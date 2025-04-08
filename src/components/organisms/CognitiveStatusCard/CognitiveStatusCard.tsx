import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { formatDate } from "../../../utils/utils";

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
  score?: string; // Added score field to match the image
  isAnyModalOpen?: boolean;
}

// Fix for the AssessmentCard component

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

      {/* Rest of your component remains the same */}
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

  useEffect(() => {
    console.log(isAnyModalOpen, "modal open in cog");

    if (patientId) {
      setLoading(true);
      axiosClient
        .get(`/cognitive-status?pid=${patientId}`)
        .then((resp) => {
          setAssessments(resp.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Failed to load assessments. Please try again later.");
          setLoading(false);
        });
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-600">
        Loading assessments...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-600">
        No assessments found for this patient.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-3 md:space-y-4">
      {assessments.map((item) => (
        <AssessmentCard
          key={item.id}
          {...item}
          isAnyModalOpen={isAnyModalOpen}
        />
      ))}
    </div>
  );
};

export default AssessmentList;
