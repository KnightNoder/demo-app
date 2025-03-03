import React from "react";

interface Prescription {
  drug_display: string;
  dosage: string;
  form: string;
  route: string;
  interval: string;
  note: string;
  refills: number;
  start_date: string;
  provider: {
    name: string;
  };
}

interface PrescriptionItemProps {
  prescription: Prescription;
}

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({ prescription }) => {
  return (
    <div className="p-4 mt-5 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{prescription.drug_display}</h3>
        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
          Verified
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
          ACE Inhibitor
        </span>
        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
          Routine
        </span>
      </div>

      {/* Dosage & Refill Info */}
      <p className="mt-2 text-sm text-gray-700">
        {prescription.dosage} {prescription.form} • {prescription.interval} • {prescription.route}
      </p>
      <p className="mt-1 text-sm text-gray-500">For: Hypertension</p>

      <div className="flex items-center justify-between mt-2">
        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
          Adherence: 95%
        </span>
        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
          Next Refill: 2/1/2024
        </span>
      </div>

      {/* Prescriber Info */}
      <div className="pt-2 mt-4">
        <p className="text-xs text-gray-500">Prescribed by</p>
        <p className="text-sm font-medium">{prescription.provider.name} (Internal Medicine)</p>
        <p className="text-xs text-gray-500">Updated about 1 year ago</p>
      </div>

      {/* Dates */}
      <div className="mt-2">
        <p className="text-xs text-gray-500">Dates</p>
        <p className="text-sm font-medium">Start: {prescription.start_date}</p>
      </div>

      {/* Interactions & Contraindications */}
      <div className="pt-2 mt-4">
        <p className="text-xs text-gray-500">Interactions</p>
        <div className="flex gap-2 mt-1">
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded">Potassium supplements</span>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded">NSAIDs</span>
        </div>

        <p className="mt-2 text-xs text-gray-500">Contraindications</p>
        <div className="flex gap-2 mt-1">
          <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded">History of angioedema</span>
          <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded">Pregnancy</span>
        </div>
      </div>

      {/* Notes */}
      <p className="mt-4 text-sm text-gray-700">{prescription.note}</p>
    </div>
  );
};

export default PrescriptionItem;
