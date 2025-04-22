import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import PhotoGalleryComponent from "../../molecules/PhotoGallery/PhotoGallery";
import axiosClient from "../../../api/axiosClient";

// Import our styled PatientCard component
import PatientCard from "../../molecules/PatientCard/PatientCard";
import Icons from "../../../assets/Icons/Icons";

interface PhotosCardProps {
  patientId: string | null;
}

const PhotosCard: React.FC<PhotosCardProps> = ({ patientId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patientImageUrl, setPatientImageUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Patient ID Card");
  const patientPhotos: any[] = [];

  const fetchPatientPhoto = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const response = await axiosClient.get(`/documents/patient-photo`, {
        params: { patient_id: patientId, category_id: 5 },
      });

      // Decode the URL from the first response
      const decodedUrl = decodeURIComponent(response.data?.url);

      // Make a second API call to the decoded URL
      const secondResponse = await axiosClient.get(decodedUrl, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(secondResponse.data);

      // Set the actual image URL from the second response
      setPatientImageUrl(blobUrl);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error processing image URL");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientPhoto();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>
        <div className="mt-4">
          <Skeleton height={200} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
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
            Unable to Load Patient Photo
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching the photo."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchPatientPhoto}
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

  const tabs = [{ label: "Patient ID Card" }, { label: "Photos" }];

  const renderTabContent = () => {
    if (activeTab === "Patient ID Card") {
      if (!patientImageUrl) {
        return (
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
              No Patient ID Photo
            </h3>
            <p className="text-sm text-gray-600">
              No ID photo is available for this patient.
            </p>
          </div>
        );
      }
      return <PatientCard patientImage={patientImageUrl} />;
    } else if (activeTab === "Photos") {
      if (patientPhotos.length === 0) {
        return (
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
              No Photos Available
            </h3>
            <p className="text-sm text-gray-600">
              No additional photos are available for this patient.
            </p>
          </div>
        );
      }
      return <PhotoGalleryComponent photos={patientPhotos} />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default PhotosCard;