import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

interface AssessmentListProps {
  patientId: null | string;
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
}

const AssessmentCard: React.FC<AssessmentCardComponentProps2> = ({
  title,
  begdate,
  enddate,
  comments,
  reported_by_patient,
  score, // Added score parameter
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-blue-600 font-light text-base font-feature-settings-normal">
            {title}
          </h3>
          <span className="ml-2 text-gray-800 text-sm">
            Score: {score || "N/A"}
          </span>
        </div>
        <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-1">
        Mini-Mental State Examination
      </p>

      <div className="text-sm text-gray-500 mt-1">
        Type: Cognitive Screening
      </div>

      <div className="mt-2">
        <div className="text-gray-500 text-sm">Comments:</div>
        <div className="text-gray-800 text-sm">{comments}</div>
      </div>

      <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>Begin: {begdate}</div>
          <div>End: {enddate || "N/A"}</div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          <div>Reported by Client:</div>
          <div>{reported_by_patient ? "Yes" : "No"}</div>
        </div>
      </div>
    </div>
  );
};

const AssessmentList: React.FC<AssessmentListProps> = ({ patientId }) => {
  const [assessments, setAssessments] = useState<
    AssessmentCardComponentProps2[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        <AssessmentCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default AssessmentList;
