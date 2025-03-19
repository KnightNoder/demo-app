import React from "react";

interface AssessmentCardProps {
  title: string;
  score: string;
  type: string;
  comments: string;
  begin: string;
  end: string;
  enc: string;
  reportedByClient: boolean;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  score,
  type,
  comments,
  begin,
  end,
  enc,
  reportedByClient,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="#" className="font-semibold text-blue-600">
            {title}
          </a>
          <span className="text-gray-700">Score: {score}</span>
        </div>
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>
      <p className="mt-1 text-gray-700">{type}</p>
      <p className="mt-2 text-sm text-gray-500">Comments: {comments}</p>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <div>
          <p>Begin: {begin}</p>
          <p>Enc: {enc}</p>
        </div>
        <div className="text-right">
          <p>End: {end}</p>
          <p>Reported by Client: {reportedByClient ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

const AssessmentList: React.FC = () => {
  const assessments = [
    {
      title: "MMSE-30",
      score: "24/30",
      type: "Mini-Mental State Examination\nType: Cognitive Screening",
      comments: "Score indicates mild cognitive impairment",
      begin: "03/17/2025 17:31:31",
      end: "03/25/2025 17:31:34",
      enc: "1234",
      reportedByClient: false,
    },
    {
      title: "MoCA-30",
      score: "26/30",
      type: "Montreal Cognitive Assessment\nType: Comprehensive Assessment",
      comments: "Follow-up assessment recommended in 6 months",
      begin: "03/17/2025 17:34:18",
      end: "03/25/2025 17:34:20",
      enc: "1235",
      reportedByClient: false,
    },
    {
      title: "GDS-15",
      score: "7/15",
      type: "Geriatric Depression Scale (Short Form)\nType: Depression Screening",
      comments: "Indicates mild depression, monitoring recommended",
      begin: "03/18/2025 09:15:00",
      end: "03/26/2025 09:15:00",
      enc: "1236",
      reportedByClient: true,
    },
  ];

  return (
    <div className="max-w-full px-12 mx-auto space-y-4">
      {assessments.map((item, index) => (
        <AssessmentCard key={index} {...item} />
      ))}
    </div>
  );
};

export default AssessmentList;
