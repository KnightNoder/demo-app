import React from "react";
import AllergyRow from "../../molecules/AllergyRow/AllergyRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";

interface AllergyTableProps {
  allergies: Array<{
    id: string;
    allergen: string;
    type: string;
    severity: string;
    reaction?: string;
    begdate: string;
    enddate?: string;
  }>;
}

const AllergyTable: React.FC<AllergyTableProps> = ({ allergies }) => {
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
