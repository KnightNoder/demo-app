import { DiagnosisItem } from '../../atoms/DiagnosisItem/DiagnosisItem';

interface DiagnosisProps {
  diagnosis: Array<{
    id: string;
    type: string;
    title: string;
    begdate: string;
    enddate: string;
    diagnosis: string;
    user: {
      id: string;
      username: string;
      fname: string;
      mname: string;
      lname: string;
    };
  }
  >
}
export const DiagnosisTable: React.FC<DiagnosisProps> = ({ diagnosis }) => {
  if (!Array.isArray(diagnosis)) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No diagnoses found
      </div>
    );
  }

  return (
    <div>
      {diagnosis.map((item) => (
        <div className='mt-2' key={item.id}>
          <DiagnosisItem item={item} />
        </div>
      ))}
    </div>
  );
};
