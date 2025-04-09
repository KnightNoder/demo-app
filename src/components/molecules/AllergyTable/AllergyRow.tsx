import React from "react";
import Row from "../Row/Row";
import Pill from "../../atoms/Pill/Pill";
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
  isAnyModalOpen?: boolean; // Added the missing prop
}

const AllergyRow: React.FC<AllergyRowProps> = ({ allergy, isAnyModalOpen }) => {
  const columnConfig: {
    key: keyof Allergy;
    label: string;
    render?: (value: any) => React.ReactNode;
  }[] = [
    { key: "title", label: "Allergy Name" },
    {
      key: "severity",
      label: "Severity",
      render: (value: Allergy["severity"]) => (
        <Pill
          text={value?.title || "N/A"}
          className={`${
            value?.title === "Fatal"
              ? "inline-flex items-center font-extralight rounded-full px-2.5 py-0.5  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-50 text-red-600 hover:bg-red-100 text-[8px]"
              : value?.title === "Moderate to severe"
                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                : value?.title === "Moderate"
                  ? "text-orange-500 bg-orange-50 hover:bg-orange-100"
                  : value?.title === "Mild to Moderate"
                    ? "text-orange-500 bg-orange-50 hover:bg-orange-100"
                    : "text-lime-500 bg-lime-50 hover:bg-lime-100"
          }`}
        />
      ),
    },
    {
      key: "reaction",
      label: "Reaction",
      render: (value: Allergy["reaction"]) => (
        <Pill text={value || "N/A"} className="text-gray-600" />
      ),
    },
    {
      key: "begdate",
      label: "Start Date",
      render: (value: Allergy["begdate"]) => formatDate(value),
    },
    {
      key: "modified_by",
      label: "Updated By",
      render: (value: Allergy["modified_by"]) =>
        value?.fname && value?.lname
          ? `Dr. ${value.fname} ${value.lname}`
          : "Dr. Ensoftek Admin",
    },
  ];

  return (
    <Row
      data={allergy}
      columnConfig={columnConfig}
      isAnyModalOpen={isAnyModalOpen}
    />
  );
};

export default AllergyRow;