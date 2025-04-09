import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

interface PatientCardProps {
  patientImage: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patientImage }) => {
  const [insuranceCard, setInsuranceCard] = useState<string | null>(null);
  const [patientImageWithHeaders, setPatientImageWithHeaders] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Function to fetch image with axiosClient (which already has sitename: current in headers)
    const fetchImageWithAxios = async () => {
      try {
        // Use axiosClient with responseType: 'blob' to get the image
        const response = await axiosClient.get(
          decodeURIComponent(patientImage),
          {
            responseType: "blob",
          }
        );

        // Create an object URL from the blob response
        const objectUrl = URL.createObjectURL(response.data);
        setPatientImageWithHeaders(objectUrl);
      } catch (error) {
        console.error("Error fetching patient image:", error);
      }
    };

    if (patientImage) {
      fetchImageWithAxios();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (patientImageWithHeaders) {
        URL.revokeObjectURL(patientImageWithHeaders);
      }
    };
  }, [patientImage]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setInsuranceCard(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // This method was unused, so we're removing it and keeping just the handleUpload method below

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Patient Info Card */}
      <div className="p-6 bg-white shadow-lg rounded-2xl w-96">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg">
            {patientImageWithHeaders ? (
              <img src={patientImageWithHeaders} alt="PatientImage" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-normal text-[#020817]">John Smith</h2>
            <p className="text-xs font-light text-gray-500">ID NUMBER: 1</p>
            <p className="text-xs font-light text-gray-500">
              DATE OF BIRTH: 5/15/1990
            </p>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t">
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">GENDER:</span>{" "}
            Male
          </p>
          <p className="flex items-start gap-2 text-xs font-light text-gray-600">
            <span className="text-xs font-normal text-[#020817]">
              EMERGENCY CONTACT:
            </span>{" "}
            (555) 123-4567
          </p>
        </div>
      </div>

      {/* Insurance Card Upload Section */}
      <div className="p-6 bg-white shadow-lg rounded-2xl w-96">
        <h3 className="text-sm font-normal text-[#020817]">Insurance Card</h3>
        <div className="flex flex-col items-center p-6 mt-4 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
          {insuranceCard ? (
            <img
              src={insuranceCard}
              alt="Insurance Card"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-10 h-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="mt-2 text-xs font-light text-gray-500">
                No insurance card uploaded
              </p>
            </div>
          )}
        </div>
        <label className="flex items-center justify-center mt-4 space-x-2 text-xs font-normal text-blue-500 cursor-pointer">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span>Upload New</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default PatientCard;
