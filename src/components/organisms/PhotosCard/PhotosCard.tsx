import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import PhotoGalleryComponent from "../../molecules/PhotoGallery/PhotoGallery";
import axiosClient from "../../../api/axiosClient";

// Import our styled PatientCard component
import PatientCard from "../../molecules/PatientCard/PatientCard";

interface PhotosCardProps {
  patientId: string | null;
}

const PhotosCard: React.FC<PhotosCardProps> = ({ patientId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patientImageUrl, setPatientImageUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Patient ID Card");
  const patientPhotos: any[] = [];

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      axiosClient
        .get(`/documents/patient-photo`, {
          params: { patient_id: patientId, category_id: 5 },
        })
        .then(async (response) => {
          try {
            // Decode the URL from the first response
            const decodedUrl = decodeURIComponent(response.data?.url);

            // Make a second API call to the decoded URL
            const secondResponse = await axiosClient.get(decodedUrl, {
              responseType: "blob",
            });

            const blobUrl = URL.createObjectURL(secondResponse.data);

            // Set the actual image URL from the second response
            setPatientImageUrl(blobUrl);
            setLoading(false);
          } catch (err: any) {
            setError(err.message || "Error processing image URL");
            setLoading(false);
          }
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
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
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="mt-4 text-center">
          <p className="text-sm font-normal text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-xs font-light text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [{ label: "Patient ID Card" }, { label: "Photos" }];

  return (
    <div className="bg-white rounded-lg p-4">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        {activeTab === "Patient ID Card" && (
          <PatientCard patientImage={patientImageUrl} />
        )}
        {activeTab === "Photos" && (
          <PhotoGalleryComponent photos={patientPhotos} />
        )}
      </div>
    </div>
  );
};

export default PhotosCard;