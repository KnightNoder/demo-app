import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import AllergyRow from "../../molecules/AllergyRow/AllergyRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";
// import { fetchAllergies } from "../../../features/allergySlice/allergyThunk";
// import { RootState } from "../../../store/store";

interface AllergyTableProps {
  allergies: Array<{
    id: string;
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
  }>;
}

const AllergyTable: React.FC<AllergyTableProps> = ({ allergies }) => {
  // const dispatch = useDispatch();



  // if (loading) {
  //   return (
  //     <div className="w-full p-4 text-center">
  //       <div className="animate-pulse">Loading allergies...</div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="w-full p-4 text-center text-red-600">
  //       Error: {error}
  //     </div>
  //   );
  // }

  if (!allergies || allergies.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No allergies found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md">
      <table className="w-full text-xs">
        <thead className="top-0 bg-gray-50">
          <tr>
            <TableHeader>Allergen</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Severity</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Reactions</TableHeader>
            <TableHeader>Onset Date</TableHeader>
            <TableHeader>Last Updated</TableHeader>
          </tr>
        </thead>
        <tbody>
          {allergies.map((allergy) => (
            <AllergyRow key={allergy.id} allergy={allergy} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllergyTable;