// MedicationItem.tsx
// import Button from "../../atoms/Button/Button";
// import Icons from "../../../assets/Icons/Icons";

import Icons from "../../../assets/Icons/Icons";
import { capitalizeWord, timeAgoFromToday } from "../../../utils/utils";

interface Medication {
  title: string;
  quantity: string;
  route: string;
  frequency: string;
  ordered_by: string;
  begdate: string;
  refill: number;
  dosage: string;
  interval: string;
  isActive: boolean;
  size_type: string
}

const MedicationItem: React.FC<{ medication: Medication }> = ({ medication }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-md rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{medication.title}</h2>
        {medication.isActive && (
          <div className="flex justify-end">
            <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">active</span>
            {/* <Button variant="primary" className="p-1">
              <Icons variant="edit" />
            </Button>
            <Button variant="secondary" className="p-1 text-red-600 hover:bg-red-200">
              <Icons variant="delete" />
            </Button> */}
          </div>
        )}
      </div>
      <p className="flex items-center text-sm text-gray-500"><Icons variant="dosage" />{medication.quantity}{medication.size_type} · {medication.route}</p>
      <div className="mt-2">
        <p className="flex items-center gap-2 text-sm text-gray-500"><Icons variant="frequency" /> <span className="text-gray-800"> {capitalizeWord(medication.interval)}</span></p>
        <p className="flex items-center gap-2 text-sm text-gray-500"><Icons variant="doctor" /> Dr.{capitalizeWord(medication.ordered_by)}</p>
        <p className="flex items-center gap-2 text-sm text-gray-500"><Icons variant="calender" /> Prescribed about {timeAgoFromToday(medication.begdate)} </p>
      </div>
      <div className="p-2 mt-3 text-xs text-gray-600 bg-gray-100 rounded-md w-fit">
        {medication.refill} refills remaining
      </div>
    </div>
  );
};

export default MedicationItem;
