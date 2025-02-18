import React, { useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
// import Button from "../../atoms/Button/Button";
// import Icons from "../../../assets/Icons/Icons";

interface Tab {
  label: string;
  count: number;
}

interface Note {
  title: string;
  category: string;
  author: string;
  time: string;
  content: string;
}

const tabs: Tab[] = [
  { label: "Progress", count: 3 },
  { label: "Consults", count: 2 },
  { label: "Orders", count: 1 },
];

const notes: Record<string, Note[]> = {
  Progress: [
    {
      title: "Daily Progress Note",
      category: "Progress",
      author: "Dr. Sarah Chen",
      time: "about 1 year ago",
      content:
        "Patient continues to improve. Vital signs stable. Afebrile. Lungs clear bilaterally. Cardiovascular: Regular rate and rhythm. Abdomen soft, non-tender. Plan: Continue current medications, advance diet as tolerated.",
    },
    {
      title: "Nursing Assessment",
      category: "Nursing",
      author: "RN Jessica Thompson",
      time: "about 1 year ago",
      content:
        "Patient alert and oriented x3. Pain well controlled (2/10). Medications administered as scheduled. Ambulating with assistance. Tolerating diet well. Foley catheter removed, voiding independently.",
    },
    {
      title: "Follow-up Note",
      category: "Progress",
      author: "Dr. James Wilson",
      time: "about 1 year ago",
      content:
        "Patient reports improved breathing. No chest pain. Decreased lower extremity edema. SpO2 96% on room air. Continue diuretics, adjust dosing based on response.",
    },
  ],
  Consults: [],
  Orders: [],
};

const TabbedNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Progress");

  return (
    <div className="px-4 pb-4 mx-auto bg-white rounded-lg shadow ">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <div className="mt-4 space-y-4">
        {notes[activeTab]?.length > 0 ? (
          notes[activeTab].map((note, index) => (
            <div
              key={index}
              className="flex justify-between p-4 border border-gray-200 rounded-md"
            >
              <div>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-xs text-gray-500">{note.author} • {note.time}</p>
                <p className="w-[80%] mt-2 text-sm text-gray-700">{note.content}</p>
              </div>
              {/* <div className="flex space-x-2">
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
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No records available.</p>
        )}
      </div>
    </div>
  );
};

export default TabbedNotes;
