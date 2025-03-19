import React from "react";

interface ICD10CardProps {
  code: string;
  description: string;
  comments: string;
  begin: string;
  end: string;
  reportedByClient: boolean;
}

const ICD10Card: React.FC<ICD10CardProps> = ({
  code,
  description,
  comments,
  begin,
  end,
  reportedByClient,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <a href="#" className="font-semibold text-blue-600">
          {code}
        </a>
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          Active
        </span>
      </div>
      <p className="mt-1 text-gray-700">{description}</p>
      <p className="mt-2 text-sm text-gray-500">Comments: {comments}</p>
      <p className="text-sm text-gray-500">Begin: {begin}</p>
      <p className="text-sm text-gray-500">End: {end}</p>
      <p className="text-sm text-gray-500">Reported by Client: {reportedByClient ? "Yes" : "No"}</p>
    </div>
  );
};

const ICD10List: React.FC = () => {
  const icdData = [
    {
      code: "ICD10:P05.04",
      description: "Newborn light for gestational age, 1000-1249 grams",
      comments: "Dummy Status",
      begin: "03/17/2025 16:51:52",
      end: "03/24/2025 16:51:55",
      reportedByClient: false,
    },
    {
      code: "ICD10:S43.121A",
      description:
        "Dislocation of right acromioclavicular joint, 100%-200% displacement, initial encounter",
      comments: "",
      begin: "03/18/2025 17:33:40",
      end: "03/26/2025 17:33:42",
      reportedByClient: false,
    },
    {
      code: "ICD10:R26.2",
      description: "Difficulty in walking, not elsewhere classified",
      comments: "Requires assistance",
      begin: "03/19/2025 09:15:30",
      end: "03/27/2025 09:15:30",
      reportedByClient: true,
    },
    {
      code: "ICD10:R27.0",
      description: "Ataxia, unspecified",
      comments: "Under evaluation",
      begin: "03/20/2025 14:22:10",
      end: "03/28/2025 14:22:10",
      reportedByClient: false,
    },
  ];

  return (
    <div className="max-w-full px-12 mx-auto space-y-4">
      {icdData.map((item, index) => (
        <ICD10Card key={index} {...item} />
      ))}
    </div>
  );
};

export default ICD10List;
