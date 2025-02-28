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

const AllergyRow: React.FC<{ allergy: Allergy }> = ({ allergy }) => {
  const columnConfig: {
    key: keyof Allergy;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any) => React.ReactNode;
  }[] = [
      { key: "title", label: "Allergy Name" },
      {
        key: "severity",
        label: "Severity",
        render: (value: Allergy["severity"]) => (
          <Pill
            text={value?.title || "N/A"}
            className={`${value?.title === "Fatal"
              ? "text-red-600 bg-red-200 hover:bg-red-300"
              : value?.title === "Moderate to severe"
                ? "text-gray-500 bg-[#FFD580] hover:bg-[#FF8C00]"
                : value?.title === "Moderate"
                  ? "text-[#8B6000] bg-[#FFEB80] hover:bg-[#FFB800]"
                  : value?.title === "Mild to Moderate"
                    ? "text-gray-700 bg-[#FFD700] hover:bg-[#FFEA00]"
                    : ""
              }`}
          />
        ),
      },
      {
        key: "reaction",
        label: "Reaction",
        render: (value: Allergy["reaction"]) => <Pill text={value || "N/A"} className="text-gray-600" />,
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
          value?.fname && value?.lname ? `Dr. ${value.fname} ${value.lname}` : "Dr. Ensoftek Admin",
      },
    ];


  return <Row data={allergy} columnConfig={columnConfig} />;
};

export default AllergyRow;
