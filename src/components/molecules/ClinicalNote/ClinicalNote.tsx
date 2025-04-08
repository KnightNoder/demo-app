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
      {/* Title with consistent font weight and size */}
      <h2 className="text-sm font-normal text-[#020817]">{title}</h2>

      {/* Author and time with icon */}
      <p className="flex items-center gap-2 mt-2 text-xs font-light text-gray-500">
        <Icons variant="doctor" />
        <span className="text-[#020817]">
          {author} • {time}
        </span>
      </p>

      {/* Content */}
      <p className="mt-2 text-xs font-light text-gray-600">{content}</p>
    </div>
  </Item>
);

export default ClinicalNoteItem;