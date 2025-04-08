import Icons from "../../../assets/Icons/Icons";
import {
  capitalize,
  capitalizeWord,
  timeAgoFromToday,
} from "../../../utils/utils";
import Item from "../../molecules/Item/Item";

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
  size_type: string;
}

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
  size_type: string;
}

const MedicationItem: React.FC<{ medication: Medication }> = ({
  medication,
}) => {
  return (
    <Item>
      <div className="flex items-center justify-between  ">
        <h2 className="text-sm font-normal">{medication.title}</h2>
        {medication.isActive && (
          <div className="flex justify-end">
            <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
              active
            </span>
          </div>
        )}
      </div>
      <p className="flex mt-2 gap-1 items-center text-xs text-gray-600 font-light">
        <Icons variant="dosage" />
        <span className="text-[#020817] ml-1">
          {medication.quantity}
          {medication.size_type} · {capitalize(medication.route)}
        </span>
      </p>
      <div className="mt-2">
        <p className="flex items-center gap-2 text-xs text-gray-500 font-light">
          <Icons variant="frequency" />
          <span className="text-[#020817]">
            {" "}
            {capitalizeWord(medication.interval)}
          </span>
        </p>
        <p className=" mt-2 flex items-center gap-2 text-xs font-light text-gray-500 ">
          <Icons variant="doctor" />
          <span className="text-[#020817]">
            Dr.{capitalizeWord(medication.ordered_by)}
          </span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Icons variant="calender" />
          <span className="text-[#020817] font-extralight">
            Prescribed about {timeAgoFromToday(medication.begdate)}
          </span>
        </p>
      </div>
      <div className="p-2 mt-3 text-[10px] text-gray-500 bg-[#F9FAFB] rounded-md w-fit">
        <span className="text-[#020817] font-extralight">
          {medication.refill} refills remaining
        </span>
      </div>
    </Item>
  );
};

export default MedicationItem;

