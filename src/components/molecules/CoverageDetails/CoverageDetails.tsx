import React from "react";

interface CoverageItem {
  name: string;
  covered: boolean;
  note?: string;
}

interface CoverageDetailsProps {
  insurance: {
    provider: string;
    type: string;
    copays: {
      primaryCare: string;
      specialistVisit: string;
      urgentCare: string;
      emergencyRoom: string;
    };
    coverage: CoverageItem[];
  };
}

const CoverageDetails: React.FC<CoverageDetailsProps> = ({ insurance }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">
        {insurance.provider}{" "}
        <span className="px-2 py-1 text-xs text-blue-800 bg-blue-200 rounded">
          {insurance.type}
        </span>
      </h2>

      <div className="mt-4">
        <h3 className="font-semibold">Copays</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div>
            <p>Primary Care Visit</p>
            <p className="font-bold">{insurance.copays.primaryCare}</p>
          </div>
          <div>
            <p>Specialist Visit</p>
            <p className="font-bold">{insurance.copays.specialistVisit}</p>
          </div>
          <div>
            <p>Urgent Care</p>
            <p className="font-bold">{insurance.copays.urgentCare}</p>
          </div>
          <div>
            <p>Emergency Room</p>
            <p className="font-bold">{insurance.copays.emergencyRoom}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Coverage Details</h3>
        <ul className="mt-2">
          {insurance.coverage.map((item, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <span className={`flex items-center ${item.covered ? "text-green-600" : "text-red-600"}`}>
                {item.covered ? "✅" : "❌"} {item.name}
              </span>
              {item.note && <span className="text-sm text-gray-500">{item.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoverageDetails;
