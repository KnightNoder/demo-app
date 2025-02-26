import React from "react";
import Item from "../../molecules/Item/Item";
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xs text-gray-500">
        {author} • {time}
      </p>
      <p className="w-[80%] mt-2 text-sm text-gray-700">{content}</p>
    </div>
  </Item>
);

export default ClinicalNoteItem;
