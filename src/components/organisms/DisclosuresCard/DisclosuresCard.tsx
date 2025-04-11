import { useEffect, useState } from "react";
import axiosClient from "../../../../src/api/axiosClient";
import GenericTableRow from "../../molecules/Row/Row";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Table from "../Table/Table";
import Skeleton from "react-loading-skeleton";
import { formatToDDMMYYYY } from "../../../utils/utils";

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
  render?: (value: any, row: T) => JSX.Element;
}

interface DisclosuresCardProps {
  patientId: null | string;
}

const DisclosuresCard: React.FC<DisclosuresCardProps> = ({ patientId }) => {
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

  // Reusable pill styling function similar to AllergyRow
  const getPillStyle = (type: string, value: string) => {
    // Base pill classes similar to AllergyRow
    const pillClasses =
      "font-normal inline-flex items-center rounded-full px-2.5 py-0.5 font-light text-[#020817] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-xs";

    if (type === "type") {
      return (
        <div
          className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
        >
          {value}
        </div>
      );
    } else if (type === "status") {
      // Status styling based on value
      switch (value.toLowerCase()) {
        case "active":
          return (
            <div
              className={`${pillClasses} bg-green-50 text-green-700 hover:bg-green-100`}
            >
              {value}
            </div>
          );
        case "expired":
          return (
            <div
              className={`${pillClasses} bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
            >
              {value}
            </div>
          );
        case "revoked":
          return (
            <div
              className={`${pillClasses} bg-red-50 text-red-700 hover:bg-red-100`}
            >
              {value}
            </div>
          );
        default:
          return (
            <div
              className={`${pillClasses} bg-gray-50 text-gray-600 hover:bg-gray-100`}
            >
              {value}
            </div>
          );
      }
    } else {
      return (
        <div
          className={`${pillClasses} bg-gray-50 text-[#020817] hover:bg-gray-100`}
        >
          {value}
        </div>
      );
    }
  };

  const columnConfig: ColumnConfig<ConsentForm2>[] = [
    { key: "description", label: "NAME" },
    {
      key: "event",
      label: "TYPE",
      render: (value) => getPillStyle("type", String(value)),
    },
    {
      key: "description", // In a real app, this would be a status field
      label: "STATUS",
      // For demo purposes, mapping description to a status value
      render: (row) => {
        // Determine status based on activeTab or some logic
        // This is just a placeholder - in a real app you'd use actual status data
        let status = "Active";
        if (row.id % 3 === 1) status = "Expired";
        if (row.id % 5 === 0) status = "Revoked";

        return getPillStyle("status", status);
      },
    },
    {
      key: "recipient",
      label: "SIGNED BY",
      render: (value) => (
        <span className="text-xs text-[#020817] font-normal">
          {String(value)}
        </span>
      ),
    },
    {
      key: "date",
      label: "SIGNED DATE",
      render: (value) => (
        <span className="text-xs text-[#020817] font-normal">
          {String(formatToDDMMYYYY(value))}
        </span>
      ),
    },
    {
      key: "description",
      label: "NOTES",
      render: (value) => (
        <span className="text-xs text-[#5B6B7A]">
          {String(value).substring(0, 20)}...
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg">
      {error && (
        <>
          <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
            <div className="flex flex-col items-center mb-4">
              <Skeleton circle height={40} width={40} />
              <div className="mt-4">
                <Skeleton height={30} width={200} />
              </div>
              <div className="mt-2">
                <Skeleton height={20} width={250} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-red-500">
                Oops! Something went wrong.
              </p>
              <p className="mt-2 text-gray-600">{error}</p>
            </div>
            <Skeleton height={50} width={180} />
          </div>
        </>
      )}
      {!error && (
        <>
          <TabListHeader
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
          <Table
            headers={columnConfig.map((col) => col.label ?? "")}
            data={consentData}
            loading={loading}
            renderRow={(row, index) => (
              <GenericTableRow
                key={index}
                data={row}
                columnConfig={columnConfig}
              />
            )}
          />
        </>
      )}
    </div>
  );
};

export default DisclosuresCard;