import {DiagnosisItem} from '../../atoms/DiagnosisItem/DiagnosisItem'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DiagnosisTable: React.FC<{ diagnosis: any[] }> = ({ diagnosis }) => (
    <div>
    {diagnosis.map((item) => (
      <DiagnosisItem key={item.id} item={item} />
    ))}
  </div>
  );