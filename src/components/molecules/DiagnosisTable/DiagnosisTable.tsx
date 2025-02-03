import {DiagnosisItem} from '../../atoms/DiagnosisItem/DiagnosisItem'
const DiagnosisTable: React.FC<{ diagnosis: any[] }> = ({ diagnosis }) => (
    <div>
      {diagnosis.map((item) => (
        <DiagnosisItem key={item.id} item={item} />
      ))}
    </div>
  );