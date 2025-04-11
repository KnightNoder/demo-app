import React from "react";
import { formatDate } from "../../../utils/utils";

interface Allergy {
  id: string;
  title: string;
  allergen: string;
  severity: {
    id: string;
    title: string | null;
  };
  reaction: string | null | undefined;
  begdate: string;
  enddate: string | undefined | null;
  modified_by: {
    fname: string;
    lname: string;
  };
}

interface AllergyRowProps {
  allergy: Allergy;
  isAnyModalOpen?: boolean;
}

const AllergyRow: React.FC<AllergyRowProps> = ({ allergy }) => {
  // Check if allergy is active based on enddate
  const isActive = () => {
    if (!allergy.enddate) return true; // If no enddate, consider it active

    const currentDate = new Date();
    const endDate = new Date(allergy.enddate);

    return endDate >= currentDate; // Active if enddate is in the future
  };

  // Activity status pill styling
  const getActivityPill = () => {
    let pillClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px]";

    if (isActive()) {
      return (
        <div
          className={`${pillClasses} bg-green-50 text-green-700 hover:bg-green-100`}
        >
          active
        </div>
      );
    } else {
      return (
        <div
          className={`${pillClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
        >
          inactive
        </div>
      );
    }
  };

  // Status pill styling for severity, following the LabReportRow pattern
  const getSeverityPill = (severity: Allergy["severity"]) => {
    let pillClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px]";

    const severityTitle = severity?.title || "N/A";

    switch (severityTitle) {
      case "Fatal":
        return (
          <div
            className={`${pillClasses} bg-red-50 text-red-700 hover:bg-red-100`}
          >
            {severityTitle}
          </div>
        );
      case "Moderate to severe":
        return (
          <div
            className={`${pillClasses} bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
          >
            {severityTitle}
          </div>
        );
      case "Moderate":
      case "Mild to Moderate":
        return (
          <div
            className={`${pillClasses} bg-orange-50 text-orange-700 hover:bg-orange-100`}
          >
            {severityTitle}
          </div>
        );
      default:
        return (
          <div
            className={`${pillClasses} bg-lime-50 text-lime-700 hover:bg-lime-100`}
          >
            {severityTitle}
          </div>
        );
    }
  };

  // Reaction pill styling
  const getReactionPill = (reaction: Allergy["reaction"]) => {
    const pillClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px]";

    return (
      <div
        className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
      >
        {reaction || "N/A"}
      </div>
    );
  };

  return (
    <tr className="transition-colors hover:bg-muted/50 my-2">
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-light text-[#020817]">
        {allergy.title}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs">
        {getSeverityPill(allergy.severity)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs">
        {getActivityPill()}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs">
        {getReactionPill(allergy.reaction)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs text-[#5B6B7A]">
        {formatDate(allergy.begdate)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs text-[#5B6B7A]">
        {allergy.modified_by?.fname && allergy.modified_by?.lname
          ? `Dr. ${allergy.modified_by.fname} ${allergy.modified_by.lname}`
          : "Dr. Ensoftek Admin"}
      </td>
    </tr>
  );
};

export default AllergyRow;
