import { useEffect, useState } from "react";
import axiosClient from "../../../../src/api/axiosClient";
import GenericTableRow from "../../molecules/Row/Row";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Table from "../Table/Table";

interface ConsentForm2 {
  id: number;
  date: string;
  event: string;
  recipient: string;
  description: string;
  patient_name: string;
  user_name: string;
}

interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => JSX.Element;
}

const DisclosuresCard = ({ patientId }: { patientId: string }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const [consentData, setConsentData] = useState<ConsentForm2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { label: "Active", count: 6 },
    { label: "Expired", count: 1 },
    { label: "Revoked", count: 1 },
    { label: "All", count: 8 },
  ];

  useEffect(() => {
    const fetchDisclosures = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/disclosures?patient_id=${patientId}`
        );
        setConsentData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDisclosures();
  }, [patientId]);

  const columnConfig: ColumnConfig<ConsentForm2>[] = [
    { key: "description", label: "NAME" },
    {
      key: "event",
      label: "TYPE",
      render: (value) => (
        <span className="px-2 py-1 text-xs text-gray-600 border rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: "description",
      label: "STATUS",
      render: (value) => (
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
          {value}
        </span>
      ),
    },
    { key: "recipient", label: "SIGNED BY" },
    { key: "date", label: "SIGNED DATE" },
    { key: "description", label: "NOTES" },
  ];

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Table
        headers={columnConfig.map((col) => col.label ?? "")}
        data={consentData}
        loading={loading}
        renderRow={(row, index) => (
          <GenericTableRow key={index} data={row} columnConfig={columnConfig} />
        )}
      />
    </div>
  );
};

export default DisclosuresCard;
