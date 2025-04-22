import { useEffect, useState, useMemo } from "react";
import axiosClient from "../../../../src/api/axiosClient";
import GenericTableRow from "../../molecules/Row/Row";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Table from "../Table/Table";
import Skeleton from "react-loading-skeleton";
import { formatToDDMMYYYY } from "../../../utils/utils";
import Icons from "../../../assets/Icons/Icons";

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
  const isRevoked = (_: ConsentForm2) => {
    return false; // This is just a demo logic, replace with real logic
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

  const fetchDisclosures = async () => {
    setLoading(true);
    setError(null);

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
      setError(
        err.message || "An unexpected error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDisclosures();
    }
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg ">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-500 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Unable to Load Disclosures
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchDisclosures}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            Retry
          </div>
        </button>
      </div>
    );
  }

  if (!Array.isArray(consentData)) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-orange-500 bg-orange-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Data Format Error
          </h3>
          <p className="text-sm text-gray-600">
            Expected an array of disclosures but received a different format.
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchDisclosures}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            Retry
          </div>
        </button>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-y-auto relative">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <div className="p-6 text-center bg-white rounded-lg">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-500 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            No Disclosures Found
          </h3>
          <p className="text-sm text-gray-600">
            {activeTab === "All"
              ? "No disclosures are available for this patient."
              : `No ${activeTab.toLowerCase()} disclosures are available for this patient.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <Table
        headers={columnConfig.map((col) => col.label ?? "")}
        data={filteredData}
        loading={false}
        renderRow={(row, index) => (
          <GenericTableRow key={index} data={row} columnConfig={columnConfig} />
        )}
      />
    </div>
  );
};

export default DisclosuresCard;