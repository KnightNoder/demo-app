import React from "react";
import { formatDate } from "../../../utils/utils";
import Item from "../../molecules/Item/Item";

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
        <h3 className="font-medium text-gray-900 text-md">{item.title}</h3>
        <div className="flex items-center text-xs text-gray-600">
          <p className="text-[#5C6D89]">Code: {item.diagnosis}</p>
          <p className="text-[#5C6D89] ml-1"> • Onset: {formatDate(item.begdate)}</p>
        </div>
        <p className="text-xs text-[#5C6D89]">
          Updated by: Dr. {item.user.fname} {item.user.lname}
        </p>
      </div>
    </Item>
  );
};
