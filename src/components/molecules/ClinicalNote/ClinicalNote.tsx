import React from "react";
import Item from "../../molecules/Item/Item";
import Icons from "../../../assets/Icons/Icons";

interface ClinicalNoteItemProps {
  title: string;
  author: string;
  time: string;
  content: string;
}

const ClinicalNoteItem: React.FC<ClinicalNoteItemProps> = ({
  title,
  author,
  time,
  content,
}) => (
  <Item>
    <div>
      {/* Title with standardized font styling */}
      <h2 className="text-sm font-normal text-[#020817]">{title}</h2>

      {/* Author and time with icon - styled consistently with other components */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <Icons variant="doctor" />
        <span>
          {author} • {time}
        </span>
      </div>

      {/* Content - standardized to match other descriptive text */}
      <p className="mt-2 text-xs font-light text-gray-600">{content}</p>
    </div>
  </Item>
);

export default ClinicalNoteItem;