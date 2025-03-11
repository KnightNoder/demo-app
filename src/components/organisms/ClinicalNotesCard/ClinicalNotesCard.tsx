import React, { useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import ClinicalNoteItem from "../../molecules/ClinicalNote/ClinicalNote";

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

const ClinicalNotesCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Progress");

  return (
    <div className="px-4 pb-4 mx-auto bg-white rounded-lg shadow">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4 space-y-4">
        {notes[activeTab]?.length > 0 ? (
          notes[activeTab].map((note, index) => (
            <ClinicalNoteItem
              key={index}
              title={note.title}
              author={note.author}
              time={note.time}
              content={note.content}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No records available.</p>
        )}
      </div>
    </div>
  );
};

export default ClinicalNotesCard;
