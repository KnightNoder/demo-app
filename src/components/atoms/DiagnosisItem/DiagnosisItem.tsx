import React from "react";
import { capitalizeWord, formatToDashDate } from "../../../utils/utils";
import Item from "../../molecules/Item/Item";
import Icons from "../../../assets/Icons/Icons";

interface DiagnosisUser {
  id: number;
  fname: string;
  mname: string;
  lname: string;
}

interface DiagnosisItemProps {
  item: {
    id: number;
    title: string;
    begdate: string;
    enddate?: string; // Making this optional since it wasn't in your example
    outcome: number;
    diagnosis: string;
    primary_diagnosis_code: number;
    modified_by: string;
    modified_on: string;
    provider: DiagnosisUser | null; // Making this nullable since it wasn't in your example
  };
  isAnyModalOpen?: boolean;
}

export const DiagnosisItem: React.FC<DiagnosisItemProps> = ({ item }) => {
  return (
    <Item>
      <div>
        <h2 className="text-sm font-normal">{item.title}</h2>
        <div className="flex mt-2 gap-1 items-center text-xs text-gray-600 font-light">
          <Icons variant="dosage" />
          <span className="text-[#020817] ml-1">Code: {item.diagnosis}</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500 font-light">
          <Icons variant="calender" />
          <span className="text-[#020817] font-extralight">
            Onset: {formatToDashDate(item.begdate)}
          </span>
        </p>
        {item.provider && (
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Icons variant="doctor" />
            <span className="text-[#020817] font-extralight">
              Dr. {capitalizeWord(item?.provider?.fname)}{" "}
              {capitalizeWord(item?.provider?.lname)}
            </span>
          </p>
        )}
      </div>
    </Item>
  );
};