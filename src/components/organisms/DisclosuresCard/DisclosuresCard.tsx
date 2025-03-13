import { useState } from "react";
import GenericTableRow from "../../molecules/Row/Row";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Table from "../Table/Table";

interface ConsentForm {
  name: string;
  type: string;
  status: string;
  signedBy: string;
  signedDate: string;
  expiration: string;
  notes?: string;
}

const DisclosuresCard = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const tabs = [
    { label: "Active", count: 6 },
    { label: "Expired", count: 1 },
    { label: "Revoked", count: 1 },
    { label: "All", count: 8 },
  ];
  const consentData: ConsentForm[] = [
    {
      name: "Notice of Privacy Practices Acknowledgment",
      type: "Hipaa",
      status: "active",
      signedBy: "John Doe",
      signedDate: "1/15/2024",
      expiration: "about 2 months ago",
      notes: "Annual renewal required",
    },
    {
      name: "Authorization to Release Information to Family Members",
      type: "Authorization",
      status: "active",
      signedBy: "John Doe",
      signedDate: "1/15/2024",
      expiration: "about 2 months ago",
      notes: "Authorized: Spouse - Jane Doe",
    },
    {
      name: "General Consent for Treatment",
      type: "Consent",
      status: "active",
      signedBy: "John Doe",
      signedDate: "1/15/2024",
      expiration: "about 2 months ago",
    },
    {
      name: "Financial Responsibility Agreement",
      type: "Acknowledgment",
      status: "active",
      signedBy: "John Doe",
      signedDate: "1/15/2024",
      expiration: "about 2 months ago",
    },
    {
      name: "Advance Directive / Living Will",
      type: "Directive",
      status: "active",
      signedBy: "John Doe",
      signedDate: "6/15/2023",
      expiration: "in over 3 years",
      notes: "Full code status",
    },
    {
      name: "Telehealth Consent",
      type: "Authorization",
      status: "active",
      signedBy: "John Doe",
      signedDate: "1/15/2024",
      expiration: "about 2 months ago",
    },
  ];

  interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    render?: (value: any) => JSX.Element;
  }

  const columnConfig: ColumnConfig<ConsentForm>[] = [
    { key: "name", label: "NAME" },
    {
      key: "type",
      label: "TYPE",
      render: (value) => (
        <span className="px-2 py-1 text-xs text-gray-600 border rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value) => (
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          {value}
        </span>
      ),
    },
    { key: "signedBy", label: "SIGNED BY" },
    { key: "signedDate", label: "SIGNED DATE" },
    {
      key: "expiration",
      label: "EXPIRATION",
      render: (value) => {
        const isExpired = value.includes("ago");
        const isFuture = value.includes("over");
        return (
          <span
            className={`text-xs ${
              isExpired
                ? "text-red-500"
                : isFuture
                  ? "text-green-500"
                  : "text-gray-600"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    { key: "notes", label: "NOTES" },
  ];
  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <Table
        headers={columnConfig.map((col) => col.label ?? "")}
        data={consentData}
        loading={false}
        renderRow={(row, index) => (
          <GenericTableRow key={index} data={row} columnConfig={columnConfig} />
        )}
      />
    </div>
  );
};

export default DisclosuresCard;
