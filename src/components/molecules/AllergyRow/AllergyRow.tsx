import React from "react";
import Pill from "../../atoms/Pill/Pill";
import TableCell from "../../atoms/TableCell/TableCell";

// AllergyRow.tsx
interface AllergyRowProps {
  allergy: {
    id: string;
    title?: string;
    allergen: string;
    severity: {
      id: string;
      title: string | null;
    };
    reaction?: {
      id: string;
      title: string | null;
    };
    begdate: string;
    enddate?: string;
  };
}


const AllergyRow: React.FC<AllergyRowProps> = ({ allergy }) => {
  return (
    <tr className="transition-colors hover:bg-muted/50 hover:bg-gray-50">
      <TableCell className="font-medium">{allergy.title}</TableCell>
      <TableCell>
        <Pill text={allergy?.title} className="text-gray-500 border border-gray-200" /> {/* Change here */}
      </TableCell>
      <TableCell>
        <Pill text={allergy.severity?.id} className="text-gray-700" />
      </TableCell>
      <TableCell>
        <Pill text="active" className="text-gray-700" />
      </TableCell>
      <TableCell>
        {allergy.reaction ? <Pill text={allergy.reaction.id} className="text-gray-600" /> : "N/A"}
      </TableCell>
      <TableCell className="text-gray-500">{allergy.begdate}</TableCell>
      <TableCell className="text-gray-500">{allergy.enddate || "N/A"}</TableCell>
    </tr>
  );
};


export default AllergyRow;
