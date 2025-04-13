import React from "react";
import { formatToDDMMYYYY } from "../../../utils/utils";

interface LabReport {
  id: string;
  test: string;
  result: string;
  range: string;
  abnormal: "normal" | "abnormal" | "";
  ordered: string;
  reported: string;
}

const LabReportRow: React.FC<{ labReport: LabReport }> = ({ labReport }) => {
  // Status pill styling based on the ClinicalNoteItem styling patterns
  const getStatusPill = (abnormal: LabReport["abnormal"]) => {
    let pillClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    switch (abnormal) {
      case "normal":
        return (
          <div
            className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
          >
            {abnormal}
          </div>
        );
      case "abnormal":
        return (
          <div
            className={`${pillClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            {abnormal}
          </div>
        );
      default:
        return (
          <div
            className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
          >
            normal
          </div>
        );
    }
  };

  return (
    <tr className="transition-colors hover:bg-muted/50 my-2">
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-normal text-[#020817]">
        {labReport.test}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-normal text-[#020817]">
        {labReport.result}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-light text-gray-600">
        {labReport.range}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle">
        {getStatusPill(labReport.abnormal)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-light text-gray-600">
        {formatToDDMMYYYY(labReport.ordered)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-light text-gray-600">
        {formatToDDMMYYYY(labReport.reported)}
      </td>
    </tr>
  );
};

export default LabReportRow;