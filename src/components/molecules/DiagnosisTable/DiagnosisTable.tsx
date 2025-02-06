import {DiagnosisItem} from '../../atoms/DiagnosisItem/DiagnosisItem'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DiagnosisTable: React.FC<{ diagnosis: any[] }> = ({ diagnosis }) => {
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
