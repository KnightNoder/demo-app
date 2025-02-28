import React from "react";
import Row from "../Row/Row";
import Pill from "../../atoms/Pill/Pill";

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
  const columnConfig: {
    key: keyof LabReport;
    label: string;
    render?: (value: any) => React.ReactNode;
  }[] = [
    { key: "test", label: "Test" },
    { key: "result", label: "Result" },
    { key: "range", label: "Range" },
    {
      key: "status",
      label: "Status",
      render: (value: LabReport["status"]) => (
        <Pill
          text={value}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === "normal"
              ? "text-green-600 bg-green-100"
              : value === "abnormal"
                ? "text-yellow-600 bg-yellow-100"
                : "text-red-600 bg-red-100"
          }`}
        />
      ),
    },
    { key: "ordered", label: "Ordered" },
    { key: "reported", label: "Reported" },
  ];

  return <Row data={labReport} columnConfig={columnConfig} />;
};

export default LabReportRow;
