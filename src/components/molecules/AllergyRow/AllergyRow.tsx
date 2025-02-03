import React from "react";
import Pill from "../../atoms/Pill/Pill";
import TableCell from "../../atoms/TableCell/TableCell";

interface AllergyRowProps {
  allergy: {
    id: string;
    allergen: string;
    type: string;
    severity: string;
    reaction?: string;
    begdate: string;
    enddate?: string;
  };
}

const AllergyRow: React.FC<AllergyRowProps> = ({ allergy }) => {
  return (
    <tr className="hover:bg-gray-50">
      <TableCell className="font-medium">{allergy.allergen}</TableCell>
      <TableCell>
        <Pill text={allergy.type} className="text-gray-500 border border-gray-200" />
      </TableCell>
      <TableCell>
        <Pill text={allergy.severity} className="text-gray-700" />
      </TableCell>
      <TableCell>
        <Pill text="Active" className="text-gray-700" />
      </TableCell>
      <TableCell>
        {allergy.reaction ? <Pill text={allergy.reaction} className="text-gray-600" /> : "N/A"}
      </TableCell>
      <TableCell className="text-gray-500">{allergy.begdate}</TableCell>
      <TableCell className="text-gray-500">{allergy.enddate || "N/A"}</TableCell>
    </tr>
  );
};

export default AllergyRow;
