import React from "react";
import {
  capitalize,
  capitalizeWord,
  formatToDashDate,
  timeAgoFromToday,
} from "../../../../utils/utils";

interface Prescription {
  id: number;
  drug_display: string;
  dosage: string;
  form: string;
  route: string;
  interval: string;
  doseother: string;
  note: string;
  quantity: string;
  quantityunit: string;
  active: number;
  ndcid: string;
  refills: number;
  start_date: string;
  provider: {
    id: number;
    name: string;
  };
}

interface PrescriptionItemProps {
  prescription: Prescription;
}

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
  prescription,
}) => {
  // Determine if the prescription is active
  const isActive = prescription.active === 1;

  // Calculate next refill date (placeholder since it's not in the API)
  const getNextRefillDate = () => {
    return "--";
  };

  return (
    <div className="border space-y-2 my-4 p-4 bg-white border-gray-200 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-normal text-[#020817]">
              {prescription.drug_display || "--"}
            </h4>
            {prescription.ndcid && (
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-gray-200 hover:bg-gray-50">
                {prescription.ndcid || "NDC ID"}
              </div>
            )}
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 hover:bg-gray-100">
              {isActive ? "routine" : "non-routine"}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-light text-gray-600">
            <span>
              {prescription.dosage || "--"} •{" "}
              {prescription.interval
                ? capitalizeWord(prescription.interval)
                : "--"}{" "}
              • {prescription.route ? capitalize(prescription.route) : "--"}
            </span>
            <span>For: {prescription.doseother || "--"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-gray-200 hover:bg-gray-50">
              Adherence: --
            </div>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 hover:bg-gray-100">
              Next Refill: {getNextRefillDate()}
            </div>
          </div>
        </div>

        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 hover:bg-gray-200">
          {isActive ? "active" : "inactive"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-xs font-light text-gray-600 mb-1">Prescribed by</p>
          <p className="text-xs font-normal text-[#020817]">
            {prescription.provider && prescription.provider.name
              ? `Dr. ${capitalizeWord(prescription.provider.name)}`
              : "--"}
          </p>
          <p className="text-xs font-light text-gray-600">
            {prescription.start_date
              ? `Updated ${timeAgoFromToday(prescription.start_date)}`
              : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs font-light text-gray-600 mb-1">Dates</p>
          <p className="text-xs font-normal text-[#020817]">
            Start: {formatToDashDate(prescription.start_date)}
          </p>
        </div>
      </div>

      {(prescription.note ||
        (prescription.refills !== undefined && prescription.refills > 0)) && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          {/* Only show interactions if there's a note */}
          {prescription.note && (
            <div>
              <p className="text-xs font-normal text-[#020817] mb-1">
                Interactions
              </p>
              <div className="flex flex-wrap gap-1">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 hover:bg-gray-100">
                  See note
                </div>
              </div>
            </div>
          )}

          {/* Show refills information if available */}
          {prescription.refills !== undefined && prescription.refills > 0 && (
            <div>
              <p className="text-xs font-normal text-[#020817] mb-1">Refills</p>
              <div className="flex flex-wrap gap-1">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 hover:bg-gray-100">
                  {prescription.refills} remaining
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note section */}
      {prescription.note && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs font-light text-gray-600">
            {prescription.note}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionItem;
