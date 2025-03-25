import { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";

interface DemographicsCardProps {
  patientId: string | null;
}

const DemographicsCard: React.FC<DemographicsCardProps> = ({ patientId }) => {
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("1Who");
  const [basicInfoData, setBasicInfoData] = useState<any[]>([]);
  const [statsInfoData, setStatsInfoData] = useState<any[]>([]);
  const [contactInfoData, setContactInfoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await axiosClient.get(
          `/patient/${patientId}/demographics`
        );
        const data = response.data;

        if (data && typeof data === "object") {
          const extractedTabs = Object.keys(data).map((key) => {
            let label = key.length > 1 ? key.slice(1) : key;
            if (key === "1Who") {
              label = "Basic";
            }
            return { key, label };
          });

          setTabs(extractedTabs);

          // Extract "1Who" data (now called "Basic") and store it
          if (data["1Who"]) {
            setBasicInfoData(data["1Who"]);
            setStatsInfoData(data["5stats"]); // Storing the array of objects
            setContactInfoData(data["2Contact"]);
          }

          console.log(data["1Who"]);

          if (extractedTabs.length > 0) {
            setActiveTab(extractedTabs[0].key);
          }
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchTabs();
    }
  }, [patientId]);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  if (loading) return <p>Loading tabs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 mx-auto rounded-lg shadow-md">
      {tabs.length > 0 ? (
        <>
          <TabListHeader
            tabs={tabs}
            activeTab={activeTab || ""}
            onTabClick={handleTabClick}
          />
          <div className="p-4">
            {activeTab &&
              renderTabContent(
                activeTab,
                basicInfoData,
                statsInfoData,
                contactInfoData
              )}
          </div>
        </>
      ) : (
        <p>No tabs available</p>
      )}
    </div>
  );
};

const renderTabContent = (
  tabKey: string,
  basicInfoData: any[],
  statsInfoData: any[],
  contactInfoData: any[]
) => {
  switch (tabKey) {
    case "Basic":
      return <BasicInfo data={basicInfoData} statsData={statsInfoData} />;
    case "Contact":
      return <ContactInfo data={contactInfoData} />;
    case "Misc":
      return <IDsInfo data={contactInfoData} />;
    default:
      return <p>Content for {tabKey} is not available.</p>;
  }
};

export default DemographicsCard;

const BasicInfo = ({ data, statsData }: { data: any[]; statsData: any[] }) => {
  const firstName = data.find((item) => item.id === "fname")?.value || "";
  const lastName = data.find((item) => item.id === "lname")?.value || "";
  const preferredName = data.find((item) => item.id === "alias")?.value || "";
  const age = data.find((item) => item.id === "DOB")?.value || "";
  const sex = data.find((item) => item.id === "sex")?.value || "";
  const race = statsData?.find((item) => item?.id === "race")?.value || "";
  const gender =
    data.find((item) => item.id === "gender_identity")?.value || "";
  const placeOfBirth =
    data.find((item) => item.id === "client_birthplace")?.value || "";

  return (
    <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
      {/* Personal Information */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Name:</strong> {firstName} {lastName}
          </p>
          <p>
            <strong>Preferred:</strong> {preferredName}
          </p>
          <p>
            <strong>Place of Birth:</strong> {placeOfBirth}
          </p>
          <p>
            <strong>DOB:</strong> {age}
          </p>
        </div>
      </div>

      {/* Gender & Identity */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Gender & Identity
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Birth Sex:</strong> {sex}
          </p>
          <p>
            <strong>Gender Identity:</strong> {gender}
          </p>
          <p>
            <strong>Pronouns:</strong> They/Them
          </p>
          <p>
            <strong>Race/Ethnicity:</strong> {race}
          </p>
        </div>
      </div>

      {/* Language & Culture */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Language & Culture
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Language:</strong> English
          </p>
          <p>
            <strong>Religion:</strong> Buddhist
          </p>
        </div>
      </div>

      {/* Social Status */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Social Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Marital Status:</strong> Married
          </p>
          <p>
            <strong>Living Arrangement:</strong> Lives with Family
          </p>
        </div>
      </div>

      {/* Employment & Education */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Employment & Education
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Employment:</strong> Full-time
          </p>
          <p>Software Engineer</p>
          <p>
            <strong>Company:</strong> Tech Company Inc.
          </p>
          <p>
            <strong>Education:</strong> Bachelor's Degree
          </p>
          <p>University of Illinois</p>
          <p>Class of 2020</p>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="col-span-2">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Emergency Contact
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Name & Relationship:</strong> Jane Doe (Spouse)
          </p>
          <p>
            <strong>Phone:</strong> 777-777-7777
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ data }: { data: any[] }) => {
  const street2 = data.find((item) => item.id === "street2")?.value || "";
  const postalCode =
    data.find((item) => item.id === "postal_code")?.value || "";
  const street = data.find((item) => item.id === "street")?.value || "";
  const city = data.find((item) => item.id === "city")?.value || "";
  const clientCounty =
    data.find((item) => item.id === "client_county")?.value || "";
  const state = data.find((item) => item.id === "state")?.value || "";
  const mobileNumber =
    data.find((item) => item.id === "phone_cell")?.value || "";

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Contact Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <p>
          <strong>Address:</strong> {street2}, {street}, {city}, {clientCounty},{" "}
          {state}, {postalCode}
        </p>
        <p>
          <strong>Mobile:</strong> {mobileNumber}
        </p>
        <p>
          <strong>Email:</strong> kgollapudi@drcloudehr.com
        </p>
      </div>
    </div>
  );
};

const IDsInfo = ({ data }: { data: any[] }) => {
  const medicadId =
    data.find((item) => item.id === "Medicaid_OHP_ID")?.value || "";

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Identification Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <p>
          <strong>MRN:</strong> 74516900
        </p>
        <p>
          <strong>SSN:</strong> XXX-XX-8999
        </p>
        <p>
          <strong>Medicaid ID:</strong> {medicadId}
        </p>
      </div>
    </div>
  );
};
