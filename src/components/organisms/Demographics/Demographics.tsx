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

// Icon components
const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

const IdCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
    />
  </svg>
);

const LanguageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
    />
  </svg>
);

const GraduationCapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-2.5 h-2.5 text-red-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
);

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

  const calculateAge = (dob: string) => {
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
              subText={`Age: ${calculateAge(dob)}`}
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
              icon={<Icons variant="phone" />}
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
            icon={<Icons variant="phone" />}
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