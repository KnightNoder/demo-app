import { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import Icons from "../../../assets/Icons/Icons";

interface DemographicsCardProps {
  patientId: string | null;
}

const DemographicsCard: React.FC<DemographicsCardProps> = ({ patientId }) => {
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("basic");
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

          // Extract data
          if (data["1Who"]) {
            setBasicInfoData(data["1Who"]);
            setStatsInfoData(data["5stats"]);
            setContactInfoData(data["2Contact"]);
          }

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
    <div className="mx-auto rounded-lg shadow-md bg-white">
      {tabs.length > 0 ? (
        <>
          <TabListHeader
            tabs={tabs}
            activeTab={activeTab || ""}
            onTabClick={handleTabClick}
          />
          <div className="p-4 h-[525px] overflow-y-auto">
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
    case "1Who":
      return <BasicInfo data={basicInfoData} statsData={statsInfoData} />;
    case "2Contact":
      return <ContactInfo data={contactInfoData} />;
    case "3IDs":
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


const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-medium text-gray-600 mb-1">{children}</p>
);

const InfoItem = ({
  icon,
  label,
  value,
  subText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subText?: string;
}) => (
  <div>
    <div className="flex items-center gap-0.5">
      {icon}
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
    <p className="text-xs pl-3">{value}</p>
    {subText && <p className="text-[10px] pl-3 text-gray-500">{subText}</p>}
  </div>
);

const BasicInfo = ({ data, statsData }: { data: any[]; statsData: any[] }) => {
  const firstName = data.find((item) => item.id === "fname")?.value || "";
  const lastName = data.find((item) => item.id === "lname")?.value || "";
  const preferredName = data.find((item) => item.id === "alias")?.value || "";
  const dob = data.find((item) => item.id === "DOB")?.value || "";
  const sex = data.find((item) => item.id === "sex")?.value || "";
  const race = statsData?.find((item) => item?.id === "race")?.value || "";
  const gender =
    data.find((item) => item.id === "gender_identity")?.value || "";
  const placeOfBirth =
    data.find((item) => item.id === "client_birthplace")?.value || "";

  const calculateAge = () => {
    // Simple age calculation, in a real app you'd want more precise logic
    return "14";
  };

  return (
    <div
      data-state="active"
      data-orientation="horizontal"
      role="tabpanel"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5"
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {/* Personal Information Section */}
        <div className="col-span-2 mb-1">
          <SectionTitle>Personal Information</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="person" />}
              label="Name"
              value={`${firstName} ${lastName}`}
              subText={`Preferred: ${preferredName}`}
            />
            <InfoItem
              icon={<Icons variant="demo-calender" />}
              label="DOB"
              value={dob}
              subText={`Age: ${calculateAge()}`}
            />
            <InfoItem
              icon={<Icons variant="globe" />}
              label="Place of Birth"
              value={placeOfBirth || "Chicago, IL"}
            />
            <InfoItem
              icon={<Icons variant="demo-id-card" />}
              label="Citizenship"
              value="US Citizen"
            />
          </div>
        </div>

        {/* Gender & Identity Section */}
        <div className="col-span-2">
          <SectionTitle>Gender & Identity</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="demo-id-card" />}
              label="Birth Sex"
              value={sex || "Male"}
            />
            <InfoItem
              icon={<Icons variant="demo-id-card" />}
              label="Gender"
              value={gender || "Male"}
            />
            <InfoItem
              icon={<Icons variant="home" />}
              label="Gender Identity"
              value="Agender"
              subText="Pronouns: They/Them"
            />
            <InfoItem
              icon={<Icons variant="globe" />}
              label="Race/Ethnicity"
              value={race || "Asian"}
              subText="Not Hispanic or Latino"
            />
          </div>
        </div>

        {/* Language & Culture Section */}
        <div className="col-span-2">
          <SectionTitle>Language & Culture</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="language" />}
              label="Language"
              value="English"
            />
            <InfoItem
              icon={<Icons variant="heart" />}
              label="Religion"
              value="Buddhist"
            />
          </div>
        </div>

        {/* Social Status Section */}
        <div className="col-span-2">
          <SectionTitle>Social Status</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="heart" />}
              label="Marital Status"
              value="Married"
            />
            <InfoItem
              icon={<Icons variant="home" />}
              label="Living Arrangement"
              value="Lives with Family"
              subText="Family Size: 4"
            />
          </div>
        </div>

        {/* Employment & Education Section */}
        <div className="col-span-2">
          <SectionTitle>Employment & Education</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="briefcase" />}
              label="Employment"
              value="Full-time"
              subText="Software Engineer"
            />
            <InfoItem
              icon={<Icons variant="graduation" />}
              label="Education"
              value="Bachelor's Degree"
              subText="University of Illinois"
            />
          </div>
        </div>

        {/* Care Preferences Section */}
        <div className="col-span-2">
          <SectionTitle>Care Preferences</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="person" />}
              label="Preferred Provider"
              value="Dr. Sarah Smith"
            />
            <InfoItem
              icon={<Icons variant="home" />}
              label="Preferred Pharmacy"
              value="CVS Pharmacy - Downtown"
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="col-span-2">
          <SectionTitle>Emergency Contact</SectionTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <InfoItem
              icon={<Icons variant="person" />}
              label="Name & Relationship"
              value="Jane Doe"
              subText="Spouse"
            />
            <InfoItem
              icon={<Icons variant="demo-phone" />}
              label="Phone"
              value="777-777-7777"
            />
          </div>
        </div>

        {/* Restrictions Section */}
        <div className="col-span-2">
          <div className="flex items-center gap-0.5">
            <Icons variant="warning" />
            <p className="text-[10px] text-red-500">
              Firearm Restriction until 11/12/2024
            </p>
          </div>
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
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div className="col-span-2">
        <SectionTitle>Contact Information</SectionTitle>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <InfoItem
            icon={<Icons variant="home" />}
            label="Address"
            value={`${street2 ? street2 + ", " : ""}${street}, ${city}, ${state} ${postalCode}`}
            subText={clientCounty ? `County: ${clientCounty}` : undefined}
          />
          <InfoItem
            icon={<Icons variant="demo-phone" />}
            label="Mobile"
            value={mobileNumber || "777-777-7777"}
          />
          <InfoItem
            icon={<Icons variant="language" />}
            label="Email"
            value="kgollapudi@drcloudehr.com"
          />
        </div>
      </div>
    </div>
  );
};

const IDsInfo = ({ data }: { data: any[] }) => {
  const medicaidId =
    data.find((item) => item.id === "Medicaid_OHP_ID")?.value || "";

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div className="col-span-2">
        <SectionTitle>Identification Information</SectionTitle>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="MRN"
            value="74516900"
          />
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="SSN"
            value="XXX-XX-8999"
          />
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="Medicaid ID"
            value={medicaidId || "Not Available"}
          />
        </div>
      </div>
    </div>
  );
};

export default DemographicsCard;