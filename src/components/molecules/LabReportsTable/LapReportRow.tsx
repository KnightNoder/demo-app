import React from "react";
import { formatToDDMMYYYY } from "../../../utils/utils";

interface LabReport {
  id: string;
  test: string;
  result: string;
  range: string;
  status: "normal" | "abnormal" | "critical";
  ordered: string;
  reported: string;
}

const LabReportRow: React.FC<{ labReport: LabReport }> = ({ labReport }) => {
  // Status pill styling based on the example
  const getStatusPill = (status: LabReport["status"]) => {
    let pillClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px]";

    switch (status) {
      case "normal":
        return (
          <div
            className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
          >
            {status}
          </div>
        );
      case "abnormal":
        return (
          <div
            className={`${pillClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            {status}
          </div>
        );
      case "critical":
        return (
          <div
            className={`${pillClasses} bg-red-50 text-red-700 hover:bg-red-100`}
          >
            {status}
          </div>
        );
      default:
        return (
          <div
            className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
          >
            {status}
          </div>
        );
    }
  };

  return (
    <tr className="transition-colors hover:bg-muted/50 my-2">
      <td className="pl-1 pr-2 py-3 align-middle text-xs font-light text-[#020817]">
        {labReport.test}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle font-light text-[#020817] text-xs">
        {labReport.result}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs text-[#5B6B7A]">
        {labReport.range}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs">
        {getStatusPill(labReport.status)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs text-[#5B6B7A]">
        {formatToDDMMYYYY(labReport.ordered)}
      </td>
      <td className="pl-1 pr-2 py-3 align-middle text-xs text-[#5B6B7A]">
        {formatToDDMMYYYY(labReport.reported)}
      </td>
    </tr>
  );
};

export default LabReportRow;