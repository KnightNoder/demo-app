import React from "react";
import Pill from "../../atoms/Pill/Pill";
import TableCell from "../../atoms/TableCell/TableCell";
import { formatDate } from '../../../utils/utils'
interface AllergyRowProps {
  allergy: {
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
      fname: string,
      lname: string
    }
  };
}


const AllergyRow: React.FC<AllergyRowProps> = ({ allergy }) => {
  return (
    <tr className="!py-10 !mt-10 transition-colors hover:bg-muted/50"> {/* Increased gap between rows */}
      <TableCell className="my-3 font-medium text-left">{allergy.title}</TableCell> {/* Optional: Increased gap in individual cells */}
      <TableCell>
        <Pill text="allergy" className="text-gray-500 bg-white border border-gray-200" />
      </TableCell>
      <TableCell>
        <Pill
          text={allergy.severity?.title}
          className={`
    text-gray-700 
    ${allergy.severity?.title === 'Fatal'
              ? 'text-red-800 bg-red-200 hover:bg-red-300'
              : allergy.severity?.title === 'Moderate to severe'
                ? 'text-red-500 bg-red-100 hover:bg-red-200'
                : allergy.severity?.title === 'Moderate'
                  ? 'text-red-400 bg-red-100  hover:bg-red-200'
                  : allergy.severity?.title === 'Mild'
                    ? 'text-yellow-500 bg-yellow-100 hover:bg-yellow-200'
                    : ''
            }
        `}
        />

      </TableCell>
      <TableCell>
        <Pill text="active" className="text-gray-700" />
      </TableCell>
      <TableCell>
        {allergy.reaction ? <Pill text={allergy.reaction || "N/A"} className="text-gray-600" /> : "N/A"}
      </TableCell>
      <TableCell className="text-gray-500">{formatDate(allergy.begdate)}</TableCell>
      <TableCell className="text-gray-500">
        {allergy?.modified_by?.fname && allergy?.modified_by?.lname
          ? `${"Dr."}${allergy.modified_by.fname} ${allergy.modified_by.lname}`
          : "Dr.Ensoftek Admin"}
      </TableCell>
    </tr>
  );
};




export default AllergyRow;
