import { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";

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
          console.log(extractedTabs, "tabs");
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

  if (loading)
    return <p className="text-xs font-light text-gray-600">Loading tabs...</p>;
  if (error)
    return <p className="text-xs font-light text-red-500">Error: {error}</p>;

  return (
    <div className="mx-auto rounded-lg shadow-md">
      {tabs.length > 0 ? (
        <>
          <TabListHeader
            tabs={tabs}
            activeTab={activeTab || ""}
            onTabClick={handleTabClick}
          />
          <div className="p-4 h-[525px]">
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
        <p className="text-xs font-light text-gray-600">No tabs available</p>
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
      return (
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
            <p className="text-sm font-normal text-red-500">
              Content for {tabKey} not available
            </p>
          </div>
          <Skeleton height={50} width={180} />
        </div>
      );
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
    <div className="grid grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">Name:</span>{" "}
            {firstName} {lastName}
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Preferred:
            </span>{" "}
            {preferredName}
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Place of Birth:
            </span>{" "}
            {placeOfBirth}
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">DOB:</span>{" "}
            {age}
          </p>
        </div>
      </div>

      {/* Gender & Identity */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Gender & Identity
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Birth Sex:
            </span>{" "}
            {sex}
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Gender Identity:
            </span>{" "}
            {gender}
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Pronouns:
            </span>{" "}
            They/Them
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Race/Ethnicity:
            </span>{" "}
            {race}
          </p>
        </div>
      </div>

      {/* Language & Culture */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Language & Culture
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Language:
            </span>{" "}
            English
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Religion:
            </span>{" "}
            Buddhist
          </p>
        </div>
      </div>

      {/* Social Status */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Social Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Marital Status:
            </span>{" "}
            Married
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Living Arrangement:
            </span>{" "}
            Lives with Family
          </p>
        </div>
      </div>

      {/* Employment & Education */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Employment & Education
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="flex items-start gap-2 text-xs font-light text-gray-600">
              <span className="text-xs font-normal text-[#020817]">
                Employment:
              </span>{" "}
              Full-time
            </p>
            <p className="ml-4 text-xs font-light text-gray-600">
              Software Engineer
            </p>
            <p className="flex items-start gap-2 text-xs font-light text-gray-600 mt-2">
              <span className="text-xs font-normal text-[#020817]">
                Company:
              </span>{" "}
              Tech Company Inc.
            </p>
          </div>
          <div>
            <p className="flex items-start gap-2 text-xs font-light text-gray-600">
              <span className="text-xs font-normal text-[#020817]">
                Education:
              </span>{" "}
              Bachelor's Degree
            </p>
            <p className="ml-4 text-xs font-light text-gray-600">
              University of Illinois
            </p>
            <p className="ml-4 text-xs font-light text-gray-600">
              Class of 2020
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="col-span-2">
        <h2 className="mb-3 text-sm font-normal text-[#020817]">
          Emergency Contact
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              Name & Relationship:
            </span>{" "}
            Jane Doe (Spouse)
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">Phone:</span>{" "}
            777-777-7777
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
      <h2 className="mb-3 text-sm font-normal text-[#020817]">
        Contact Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">Address:</span>{" "}
          {street2}, {street}, {city}, {clientCounty}, {state}, {postalCode}
        </p>
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">Mobile:</span>{" "}
          {mobileNumber}
        </p>
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">Email:</span>{" "}
          kgollapudi@drcloudehr.com
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
      <h2 className="mb-3 text-sm font-normal text-[#020817]">
        Identification Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">MRN:</span>{" "}
          74516900
        </p>
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">SSN:</span>{" "}
          XXX-XX-8999
        </p>
        <p className="flex items-start gap-2 text-xs font-light text-gray-600">
          <span className="text-xs font-normal text-[#020817]">
            Medicaid ID:
          </span>{" "}
          {medicadId}
        </p>
      </div>
    </div>
  );
};