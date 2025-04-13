import { useEffect, useState, useMemo } from "react";
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
  status?: string; // Add optional status field for filtering
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

  // Calculate tab counts based on filtered data
  const getTabCounts = (data: ConsentForm2[]) => {
    const today = new Date();

    const active = data.filter(
      (item) => new Date(item.date) > today && !isRevoked(item)
    );
    const expired = data.filter((item) => new Date(item.date) < today);
    const revoked = data.filter((item) => isRevoked(item));

    return {
      Active: active.length,
      Expired: expired.length,
      Revoked: revoked.length,
      All: data.length,
    };
  };

  // Function to determine if an item is revoked (for demo purpose)
  const isRevoked = (item: ConsentForm2) => {
    return item.id % 5 === 0; // This is just a demo logic, replace with real logic
  };

  // Calculate status for an item based on date and revoked condition
  const calculateStatus = (item: ConsentForm2): string => {
    const today = new Date();
    const itemDate = new Date(item.date);

    if (isRevoked(item)) {
      return "Revoked";
    } else if (itemDate < today) {
      return "Expired";
    } else {
      return "Active";
    }
  };

  useEffect(() => {
    const fetchDisclosures = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/disclosures?patient_id=${patientId}`
        );

        // Add calculated status to each item
        const dataWithStatus = response.data.map((item: ConsentForm2) => ({
          ...item,
          status: calculateStatus(item),
        }));

        setConsentData(dataWithStatus);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDisclosures();
  }, [patientId]);

  // Create dynamic tabs with updated counts
  const tabs = useMemo(() => {
    const counts = getTabCounts(consentData);
    return [
      { label: "Active", count: counts.Active },
      { label: "Expired", count: counts.Expired },
      { label: "Revoked", count: counts.Revoked },
      { label: "All", count: counts.All },
    ];
  }, [consentData]);

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    const today = new Date();

    switch (activeTab) {
      case "Active":
        return consentData.filter(
          (item) => new Date(item.date) > today && !isRevoked(item)
        );
      case "Expired":
        return consentData.filter((item) => new Date(item.date) < today);
      case "Revoked":
        return consentData.filter((item) => isRevoked(item));
      case "All":
      default:
        return consentData;
    }
  }, [consentData, activeTab]);

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
      key: "status",
      label: "STATUS",
      render: (_, row) => {
        // Use the calculated status stored on the item
        return getPillStyle("status", row.status || calculateStatus(row));
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
            data={filteredData}
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
