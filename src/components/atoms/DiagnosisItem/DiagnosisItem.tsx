import React from "react";
import { formatDate, capitalizeWord } from "../../../utils/utils";
import Item from "../../molecules/Item/Item";
import Icons from "../../../assets/Icons/Icons";

interface DiagnosisItemProps {
  item: {
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
  };
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
            Onset: {formatDate(item.begdate)}
          </span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Icons variant="doctor" />
          <span className="text-[#020817] font-extralight">
            Dr. {capitalizeWord(item.user.fname)}{" "}
            {capitalizeWord(item.user.lname)}
          </span>
        </p>
      </div>
    </Item>
  );
};