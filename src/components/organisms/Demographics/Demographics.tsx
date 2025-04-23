import { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import Icons from "../../../assets/Icons/Icons";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface DemographicsCardProps {
  patientId: string | null;
}

const DemographicsCard: React.FC<DemographicsCardProps> = ({ patientId }) => {
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("Basic");
  const [basicInfoData, setBasicInfoData] = useState<any[]>([]);
  const [statsInfoData, setStatsInfoData] = useState<any[]>([]);
  const [contactInfoData, setContactInfoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTabs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(
        `/patient/${patientId}/demographics`
      );
      const data = response.data;

      if (data && typeof data === "object") {
        // Map API's section keys to UI-friendly labels
        const keyToLabelMap: Record<string, string> = {
          "1Who": "Basic",
          "2Contact": "Contact",
          "3Choices": "Choices",
          "4Employer": "Employment",
          "5Stats": "Statistics",
          "6Misc": "Miscellaneous",
          "7Pregnancy": "Pregnancy",
          // Add other mappings as needed
        };

        const extractedTabs = Object.keys(data).map((key) => {
          // Use our mapping or fallback to a cleaned-up version of the key
          const label = keyToLabelMap[key] || key.replace(/^\d+/, "");
          return { key, label };
        });

        setTabs(extractedTabs);

        // Store data by section
        if (data["1Who"]) {
          setBasicInfoData(data["1Who"]);
        }
        if (data["5Stats"]) {
          setStatsInfoData(data["5Stats"]);
        }
        if (data["2Contact"]) {
          setContactInfoData(data["2Contact"]);
        }

        // Set initial active tab to "Basic" (which is stored as "1Who" in the API)
        setActiveTab("Basic");
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchTabs();
    }
  }, [patientId]);

  const handleTabClick = (label: string) => {
    // Find the tab with the matching label to get its key
    const tab = tabs.find((tab) => tab.label === label);
    if (tab) {
      setActiveTab(label);
    }
  };

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
      <ErrorComponent
        title="Unable to Load Demographics"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchTabs}
      />
    );
  }

  if (tabs.length === 0) {
    return (
      <div className="pb-4 mx-auto bg-white rounded-lg overflow-y-auto relative">
        <EmptyStateComponent
          title="No Demographics Data"
          message="No demographic information is available for this patient."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg shadow-md bg-white">
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
    </div>
  );
};

const renderTabContent = (
  tabKey: string,
  basicInfoData: any[],
  statsInfoData: any[],
  contactInfoData: any[]
) => {
  // We now use the tab labels to determine which component to render
  switch (tabKey) {
    case "Basic":
      return <BasicInfo data={basicInfoData} statsData={statsInfoData} />;
    case "Contact":
      return <ContactInfo data={contactInfoData} />;
    case "Choices":
      return <IDsInfo data={basicInfoData} />;
    default:
      return (
        <EmptyStateComponent
          title={`${tabKey} Information`}
          message={`Content for ${tabKey} is not available.`}
        />
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
  // Extract available fields from API data
  const firstName = data.find((item) => item.id === "fname")?.value || "--";
  const lastName = data.find((item) => item.id === "lname")?.value || "--";
  const preferredName = data.find((item) => item.id === "alias")?.value || "--";
  const dob = data.find((item) => item.id === "DOB")?.value || "--";
  const sex = data.find((item) => item.id === "sex")?.value || "--";
  const gender =
    data.find((item) => item.id === "gender_identity")?.value || "--";
  const race = statsData?.find((item) => item?.id === "race")?.value || "--";
  const ethnicity =
    statsData?.find((item) => item?.id === "ethnicity")?.value || "--";
  const language = data.find((item) => item.id === "language")?.value || "--";
  const school = data.find((item) => item.id === "school_name")?.value || "--";
  const courtRestriction =
    data.find((item) => item.id === "court")?.value || "--";
  const courtDate =
    data.find((item) => item.id === "court_date")?.value || "--";

  // Fields with no direct API mapping - using placeholders
  const placeOfBirth = "--";
  const citizenship = "US Citizen";
  const religion = "--";
  const maritalStatus = "--";
  const livingArrangement = "--";
  const familySize = "--";
  const employment = "--";
  const occupation = "--";
  const education = "--";
  const preferredProvider = "--";
  const preferredPharmacy = "--";
  const emergName = "--";
  const emergRelation = "--";
  const emergPhone = "--";

  const calculateAge = () => {
    if (!dob || dob === "--") return "--";
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age.toString();
    } catch (e) {
      return "--";
    }
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
              value={placeOfBirth}
            />
            <InfoItem
              icon={<Icons variant="demo-id-card" />}
              label="Citizenship"
              value={citizenship}
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
              value={sex}
            />
            <InfoItem
              icon={<Icons variant="demo-id-card" />}
              label="Gender"
              value={gender}
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
              value={race}
              subText={
                ethnicity !== "--" ? ethnicity : "Not Hispanic or Latino"
              }
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
              value={language}
            />
            <InfoItem
              icon={<Icons variant="heart" />}
              label="Religion"
              value={religion}
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
              value={maritalStatus}
            />
            <InfoItem
              icon={<Icons variant="home" />}
              label="Living Arrangement"
              value={livingArrangement}
              subText={`Family Size: ${familySize}`}
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
              value={employment}
              subText={occupation}
            />
            <InfoItem
              icon={<Icons variant="graduation" />}
              label="Education"
              value={education}
              subText={school}
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
              value={preferredProvider}
            />
            <InfoItem
              icon={<Icons variant="home" />}
              label="Preferred Pharmacy"
              value={preferredPharmacy}
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
              value={emergName}
              subText={emergRelation}
            />
            <InfoItem
              icon={<Icons variant="demo-phone" />}
              label="Phone"
              value={emergPhone}
            />
          </div>
        </div>

        {/* Restrictions Section */}
        {courtRestriction === "YES" && (
          <div className="col-span-2">
            <div className="flex items-center gap-0.5">
              <Icons variant="warning" />
              <p className="text-[10px] text-red-500">
                Firearm Restriction{" "}
                {courtDate !== "--" ? `until ${courtDate}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactInfo = ({ data }: { data: any[] }) => {
  // Extract available fields from API data
  const street = data.find((item) => item.id === "street")?.value || "--";
  const street2 = data.find((item) => item.id === "street2")?.value || "--";
  const city = data.find((item) => item.id === "city")?.value || "--";
  const state = data.find((item) => item.id === "state")?.value || "--";
  const postalCode =
    data.find((item) => item.id === "postal_code")?.value || "--";
  const county =
    data.find((item) => item.id === "client_county")?.value || "--";
  const mobileNumber =
    data.find((item) => item.id === "phone_cell")?.value || "--";
  const email = data.find((item) => item.id === "email")?.value || "--";

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div className="col-span-2">
        <SectionTitle>Contact Information</SectionTitle>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <InfoItem
            icon={<Icons variant="home" />}
            label="Address"
            value={`${street2 !== "--" ? street2 + ", " : ""}${street}, ${city}, ${state} ${postalCode}`}
            subText={county !== "--" ? `County: ${county}` : undefined}
          />
          <InfoItem
            icon={<Icons variant="demo-phone" />}
            label="Mobile"
            value={mobileNumber}
          />
          <InfoItem
            icon={<Icons variant="language" />}
            label="Email"
            value={email}
          />
        </div>
      </div>
    </div>
  );
};

const IDsInfo = ({ data }: { data: any[] }) => {
  // Extract available fields from API data
  const mrn = data.find((item) => item.id === "top_id")?.value || "--";
  const ssn = data.find((item) => item.id === "ss")?.value || "--";
  const medicaidId =
    data.find((item) => item.id === "Medicaid_OHP_ID")?.value || "--";

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div className="col-span-2">
        <SectionTitle>Identification Information</SectionTitle>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="MRN"
            value={mrn !== "--" ? mrn : "74516900"}
          />
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="SSN"
            value={ssn}
          />
          <InfoItem
            icon={<Icons variant="demo-id-card" />}
            label="Medicaid ID"
            value={medicaidId !== "--" ? medicaidId : "Not Available"}
          />
        </div>
      </div>
    </div>
  );
};

export default DemographicsCard;