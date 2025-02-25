import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AllergyRow from "../../molecules/AllergyRow/AllergyRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";

interface AllergyTableProps {
  allergies: Array<{
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
  }>;
  loading: boolean;
  tableHeaders: string[];
}

const AllergyTable: React.FC<AllergyTableProps> = ({ allergies, loading, tableHeaders }) => {
  if (!Array.isArray(allergies)) {
    return (
      <div className="w-full p-4 text-center text-red-600">
        Error: Expected an array of allergies.
      </div>
    );
  }

  if (allergies.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No allergies found
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
                <td><Skeleton width={150} /></td>
                <td><Skeleton width={100} /></td>
                <td><Skeleton width={80} /></td>
                <td><Skeleton width={80} /></td>
                <td><Skeleton width={120} /></td>
                <td><Skeleton width={100} /></td>
                <td><Skeleton width={100} /></td>
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
        <tbody className="mt-6">
          {allergies.map((allergy) => (
            <AllergyRow key={allergy.id} allergy={allergy} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllergyTable;
