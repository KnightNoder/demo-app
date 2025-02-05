import React, { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";

const AllergiesCard: React.FC = () => {
  // Local state management for allergies, loading, and error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allergies, setAllergies] = useState<any[]>([]); // Type as 'any' for simplicity
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState("Active");

  // Tabs data, can be modified based on your need
  const tabs = [
    { label: "Active", count: allergies.length },
    { label: "Allergy", count: 0 }, // You may adjust this count dynamically
    { label: "Others", count: allergies.length },
  ];

  // Fetch allergies data when the component mounts
  useEffect(() => {
    const fetchAllergiesData = async () => {
      setLoading(true);
      setError(null); // Clear error before making the API call

      try {
        const response = await fetch(
          "http://qa-phoenix.drcloudemr.com/drcloud_1/public/api/allergies/1004785/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch allergies data");
        }

        const data = await response.json();
        setAllergies(data.data); // Set the fetched allergies data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching allergies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllergiesData(); // Call the function on mount
  }, []);

  // Loading state: display loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state: display error message if something goes wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        <AllergyTable allergies={allergies} />
      </div>
    </div>
  );
};

export default AllergiesCard;
