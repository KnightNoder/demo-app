import { useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";

const DemographicsCard = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const tabs = [
    { key: "basic", label: "Basic" },
    { key: "contact", label: "Contact" },
    { key: "ids", label: "IDs" },
  ];
  const handleTabClick = (label: string) => {
    const tab = tabs.find((t) => t.label === label);
    if (tab) {
      setActiveTab(tab.key);
    }
  };

  return (
    <div className="p-4 mx-auto rounded-lg shadow-md">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <div className="p-4">
        {activeTab === "basic" && <BasicInfo />}
        {activeTab === "contact" && <ContactInfo />}
        {activeTab === "ids" && <IDsInfo />}
      </div>
    </div>
  );
};

const BasicInfo = () => (
  <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
    {/* Personal Information */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Personal Information
      </h2>
      <p className="flex items-center">
        <span className="mr-2">{/* User Icon */}</span> <strong>Name:</strong>{" "}
        Test Individual
      </p>
      <p>
        <strong>Preferred:</strong> Test
      </p>
      <p className="flex items-center">
        <span className="mr-2">{/* Globe Icon */}</span>{" "}
        <strong>Place of Birth:</strong> Chicago, IL
      </p>
    </div>
    <div>
      <p className="flex items-center">
        <span className="mr-2">{/* Cake Icon */}</span> <strong>DOB:</strong>{" "}
        07/07/2009
      </p>
      <p>
        <strong>Age:</strong> 14
      </p>
      <p className="flex items-center">
        <span className="mr-2">{/* ID Card Icon */}</span>{" "}
        <strong>Citizenship:</strong> US Citizen
      </p>
    </div>

    {/* Gender & Identity */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Gender & Identity
      </h2>
      <p>
        <strong>Birth Sex:</strong> Male
      </p>
      <p>
        <strong>Gender Identity:</strong> Agender
      </p>
      <p>
        <strong>Pronouns:</strong> They/Them
      </p>
    </div>
    <div>
      <p>
        <strong>Race/Ethnicity:</strong> Asian
      </p>
      <p>Not Hispanic or Latino</p>
    </div>

    {/* Language & Culture */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Language & Culture
      </h2>
      <p className="flex items-center">
        <span className="mr-2">{/* Language Icon */}</span>{" "}
        <strong>Language:</strong> English
      </p>
    </div>
    <div>
      <p className="flex items-center">
        <span className="mr-2">{/* Book Icon */}</span>{" "}
        <strong>Religion:</strong> Buddhist
      </p>
    </div>

    {/* Social Status */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Social Status
      </h2>
      <p>
        <strong>Marital Status:</strong> Married
      </p>
    </div>
    <div>
      <p>
        <strong>Living Arrangement:</strong> Lives with Family
      </p>
      <p>Family Size: 4</p>
    </div>

    {/* Employment & Education */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Employment & Education
      </h2>
      <p className="flex items-center">
        <span className="mr-2">{/* Briefcase Icon */}</span>{" "}
        <strong>Employment:</strong> Full-time
      </p>
      <p>Software Engineer</p>
      <p>Tech Company Inc.</p>
    </div>
    <div>
      <p>
        <strong>Education:</strong> Bachelor's Degree
      </p>
      <p>University of Illinois</p>
      <p>Class of 2020</p>
    </div>

    {/* Care Preferences */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Care Preferences
      </h2>
      <p className="flex items-center">
        <span className="mr-2">{/* Hospital Icon */}</span>{" "}
        <strong>Preferred Provider:</strong> Dr. Sarah Smith
      </p>
      <p>
        <strong>Preferred Pharmacy:</strong> CVS Pharmacy - Downtown
      </p>
    </div>

    {/* Emergency Contact */}
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Emergency Contact
      </h2>
      <p className="flex items-center">
        <span className="mr-2">{/* User Icon */}</span>{" "}
        <strong>Name & Relationship:</strong> Jane Doe (Spouse)
      </p>
      <p className="flex items-center">
        <span className="mr-2">{/* Phone Icon */}</span> <strong>Phone:</strong>{" "}
        777-777-7777
      </p>
    </div>

    {/* Alert */}
    <div className="flex items-center col-span-2 px-4 py-2 mt-6 text-sm font-medium text-red-700 bg-red-100 border-l-4 border-red-500">
      <span className="mr-2">{/* Warning Icon */}</span>
      <p>⚠ Firearm Restriction until 11/12/2024</p>
    </div>
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

const IDsInfo = () => (
  <div>
    <h2 className="text-lg font-semibold">Identification Information</h2>
    <p>MRN: 74516900</p>
    <p>SSN: XXX-XX-8999</p>
    <p>Medicaid ID: 784261542</p>
  </div>
);

export default DemographicsCard;
