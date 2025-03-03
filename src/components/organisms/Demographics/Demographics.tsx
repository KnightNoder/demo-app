import { useState } from "react";

const DemographicsCard = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="max-w-xl p-4 mx-auto border rounded-lg shadow-md">
      <div className="flex border-b">
        {[
          { key: "basic", label: "Basic" },
          { key: "contact", label: "Contact" },
          { key: "third", label: "Third Tab" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 p-2 text-center ${
              activeTab === tab.key ? "border-b-2 border-blue-500" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === "basic" && <BasicInfo />}
        {activeTab === "contact" && <ContactInfo />}
        {activeTab === "third" && <ThirdInfo />}
      </div>
    </div>
  );
};

const BasicInfo = () => (
  <div>
    <h2 className="text-lg font-semibold">Personal Information</h2>
    <p>Name: Test Individual</p>
    <p>DOB: 07/07/2009</p>
    <p>Gender: Male</p>
    <p>Citizenship: US Citizen</p>
  </div>
);

const ContactInfo = () => (
  <div>
    <h2 className="text-lg font-semibold">Contact Information</h2>
    <p>Address: 150 feet road, 10th street, Chicago, IL 07863</p>
    <p>Mobile: 777-777-5758</p>
    <p>Email: kgollapudi@drcloudehr.com</p>
  </div>
);

const ThirdInfo = () => (
  <div>
    <h2 className="text-lg font-semibold">Medical Information</h2>
    <p>MRN: 74516900</p>
    <p>SSN: XXX-XX-8999</p>
    <p>Medicaid ID: 784261542</p>
  </div>
);

export default DemographicsCard;
