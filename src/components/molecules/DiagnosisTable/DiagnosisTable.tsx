import { DiagnosisItem } from "../../atoms/DiagnosisItem/DiagnosisItem";

interface DiagnosisUser {
  id: number;
  username: string;
  fname: string;
  mname: string;
  lname: string;
}

interface DiagnosisProps {
  diagnosis: Array<{
    id: number;
    title: string;
    begdate: string;
    enddate?: string;
    outcome: number;
    diagnosis: string;
    primary_diagnosis_code: number;
    modified_by: string;
    modified_on: string;
    user: DiagnosisUser;
  }>;
  isAnyModalOpen?: boolean;
}

export const DiagnosisTable: React.FC<DiagnosisProps> = ({
  diagnosis,
  isAnyModalOpen,
}) => {
  if (!Array.isArray(diagnosis) || diagnosis.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No diagnoses found
      </div>
    );
  }

  return (
    <div>
      {diagnosis.map((item, index) => {
        // Create a unique key by combining the ID with other unique data
        // This ensures uniqueness even if IDs are duplicated
        const uniqueKey = `${item.id}-${item.modified_on}-${index}`;

        return (
          <div className="mt-2" key={uniqueKey}>
            <DiagnosisItem item={item} isAnyModalOpen={isAnyModalOpen} />
          </div>
        );
      })}
    </div>
  );
};
