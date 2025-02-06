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
    return <div>No diagnosis data available</div>;
  }

  return (
    <div>
      {diagnosis.map((item) => (
        <DiagnosisItem key={item.id} item={item} />
      ))}
    </div>
  );
};
