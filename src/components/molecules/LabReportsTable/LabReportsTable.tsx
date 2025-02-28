import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LabReportRow from "./LapReportRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";

interface LabReportsTableProps {
  labReports: Array<{
    id: string;
    test: string;
    result: string;
    range: string;
    status: "normal" | "abnormal" | "critical";
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
      <div className="w-full p-4 text-center text-red-600">
        Error: Expected an array of lab reports.
      </div>
    );
  }

  if (labReports.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No lab reports found
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-md">
        <table className="w-full text-xs">
          <thead className="top-0 bg-gray-50">
            <tr>
              {tableHeaders.map((header, index) => (
                <TableHeader key={index}>{header}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton width={150} />
                </td>
                <td>
                  <Skeleton width={100} />
                </td>
                <td>
                  <Skeleton width={80} />
                </td>
                <td>
                  <Skeleton width={80} />
                </td>
                <td>
                  <Skeleton width={120} />
                </td>
                <td>
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
      <table className="w-full text-xs">
        <thead className="top-0 bg-gray-50">
          <tr>
            {tableHeaders.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {labReports.map((report) => (
            <LabReportRow key={report.id} labReport={report} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabReportsTable;
