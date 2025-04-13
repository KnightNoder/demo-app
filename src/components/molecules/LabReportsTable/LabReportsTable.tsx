import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LabReportRow from "../../molecules/LabReportsTable/LapReportRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";

interface LabReportsTableProps {
  labReports: Array<{
    id: string;
    test: string;
    result: string;
    range: string;
    abnormal: "normal" | "abnormal" | "";
    ordered: string;
    reported: string;
  }>;
  loading: boolean;
  tableHeaders: string[];
}

const LabReportsTable: React.FC<LabReportsTableProps> = ({
  labReports,
  loading,
  tableHeaders,
}) => {
  if (!Array.isArray(labReports)) {
    return (
      <div className="w-full p-4 text-center text-xs font-normal text-red-600">
        Error: Expected an array of lab reports.
      </div>
    );
  }

  if (labReports.length === 0) {
    return (
      <div className="w-full p-4 text-center text-xs font-light text-gray-600">
        No lab reports found
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-md">
        <table className="w-full text-xs border-spacing-y-2 border-separate">
          <thead className="top-0 bg-gray-50">
            <tr>
              {tableHeaders.map((header, index) => (
                <TableHeader key={`header-${index}`}>{header}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={`skeleton-row-${index}`} className="my-2">
                <td className="py-3">
                  <Skeleton width={150} />
                </td>
                <td className="py-3">
                  <Skeleton width={100} />
                </td>
                <td className="py-3">
                  <Skeleton width={80} />
                </td>
                <td className="py-3">
                  <Skeleton width={80} />
                </td>
                <td className="py-3">
                  <Skeleton width={120} />
                </td>
                <td className="py-3">
                  <Skeleton width={100} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md">
      <table className="w-full text-xs border-spacing-y-2 border-separate">
        <thead className="top-0 bg-gray-50">
          <tr>
            {tableHeaders.map((header, index) => (
              <TableHeader key={`header-${index}`}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {labReports.map((report, index) => (
            <LabReportRow key={`${report.id}-${index}`} labReport={report} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabReportsTable;