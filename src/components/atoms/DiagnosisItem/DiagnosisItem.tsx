import React from "react";
import { formatDate } from "../../../utils/utils";
import Button from "../Button/Button";
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
    <div className="flex justify-between p-4 mb-2 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium text-gray-900 text-md">{item.title}</h3>
        <div className="flex items-center text-xs text-gray-600">
          <p className="text-[#5C6D89]">Code: {item.diagnosis}</p>
          <p className="text-[#5C6D89] ml-1"> • Onset:  {formatDate(item.begdate)}</p>
        </div>
        <p className="text-xs  text-[#5C6D89]">
          Updated by: Dr. {item.user.fname} {item.user.lname}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="primary"
          className="p-1"
        // onClick={() => onEdit(allergy.id)}
        >
          <Icons variant="edit" />
        </Button>
        <Button
          variant="secondary"
          className="p-1 text-red-600 hover:bg-red-200"
        // onClick={() => onDelete(allergy.id)}
        >
          <Icons variant="delete" />
        </Button>
      </div>
    </div>
  );
};
