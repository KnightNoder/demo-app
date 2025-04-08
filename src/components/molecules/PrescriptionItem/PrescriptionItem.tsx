import React from "react";
import Icons from "../../../assets/Icons/Icons";
import {
  capitalize,
  capitalizeWord,
  timeAgoFromToday,
} from "../../../utils/utils";

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

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
  prescription,
}) => {
  return (
    <div className="p-4 my-6 rounded-lg border border-gray-200  bg-white  shadow-sm">
      {/* Header - Title and Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-normal">{prescription.drug_display}</h2>
        <div className="flex justify-end">
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
            Verified
          </span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="px-2 py-0.5 text-xs text-blue-600 bg-blue-100 rounded-md">
          ACE Inhibitor
        </span>
        <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md">
          Routine
        </span>
      </div>

      {/* Dosage Info */}
      <p className="flex mt-2 gap-1 items-center text-xs text-gray-600 font-light">
        <Icons variant="dosage" />
        <span className="text-[#020817] ml-1">
          {prescription.dosage} {prescription.form} ·{" "}
          {capitalize(prescription.route)}
        </span>
      </p>

      {/* Usage */}
      <p className="mt-1 text-xs text-gray-500 font-light">For: Hypertension</p>

      {/* Details */}
      <div className="mt-2">
        {/* Interval/Frequency */}
        <p className="flex items-center gap-2 text-xs text-gray-500 font-light">
          <Icons variant="frequency" />
          <span className="text-[#020817]">
            {capitalizeWord(prescription.interval)}
          </span>
        </p>

        {/* Provider */}
        <p className="mt-2 flex items-center gap-2 text-xs font-light text-gray-500">
          <Icons variant="doctor" />
          <span className="text-[#020817]">
            Dr. {capitalizeWord(prescription.provider.name)}
          </span>
        </p>

        {/* Date */}
        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Icons variant="appointment-calender" />
          <span className="text-[#020817] font-extralight">
            Prescribed about {timeAgoFromToday(prescription.start_date)}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-2 mt-3">
        <div className="p-2 text-[10px] text-gray-500 bg-[#F9FAFB] rounded-md w-fit">
          <span className="text-[#020817] font-extralight">
            {prescription.refills} refills remaining
          </span>
        </div>
        <div className="p-2 text-[10px] text-green-700 bg-green-50 rounded-md w-fit">
          <span className="font-extralight">Adherence: 95%</span>
        </div>
      </div>

      {/* Interactions - only if needed */}
      {prescription.note && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">Interactions</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md">
              Potassium supplements
            </span>
            <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md">
              NSAIDs
            </span>
          </div>
        </div>
      )}

      {/* Note - only if provided */}
      {prescription.note && (
        <div className="mt-3 text-xs text-gray-500">
          <span className="font-medium">Note:</span> {prescription.note}
        </div>
      )}
    </div>
  );
};

export default PrescriptionItem;