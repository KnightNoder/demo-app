import React from "react";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import AllergyRow from "../../molecules/AllergyRow/AllergyRow";
import TableHeader from "../../atoms/TableHeader/TableHeader";

// Define props for AllergyTable
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
    enddate: string | undefined | null;
  }>;
  loading: boolean; // Added loading state to trigger skeleton loader
}

const AllergyTable: React.FC<AllergyTableProps> = ({ allergies, loading }) => {
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
        No allergies found.
      </div>
    );
  }

  // Display Skeleton Loader when loading is true
  if (loading) {
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
            {/* Render Skeleton for each row */}
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
            <TableHeader>Allergen</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Severity</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Reactions</TableHeader>
            <TableHeader>Onset Date</TableHeader>
            <TableHeader>Last Updated</TableHeader>
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
