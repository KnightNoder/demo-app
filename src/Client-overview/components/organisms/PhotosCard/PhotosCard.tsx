import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import PhotoGalleryComponent from "../../molecules/PhotoGallery/PhotoGallery";
import axiosClient from "../../../../api/axiosClient";
import PatientCard from "../../molecules/PatientCard/PatientCard";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface PhotosCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const PhotosCard: React.FC<PhotosCardProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patientImageUrl, setPatientImageUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Patient ID Card");
  const patientPhotos: any[] = [];

  const fetchCategoryId = async (): Promise<number> => {
    try {
      const response = await axiosClient.get(
        "/document-categories/patient-photograph-document-category-id"
      );
      return response.data.data.id;
    } catch (err: any) {
      console.error("Error fetching category ID:", err);
      // Fallback to default category ID if API call fails
      return 5;
    }
  };

  const fetchPatientPhoto = async () => {
    if (!patientId) return;

    try {
      setLoading(true);

      // Get category ID from API
      const categoryId = await fetchCategoryId();

      const response = await axiosClient.get("/documents/patient-photo", {
        params: { patient_id: patientId, category_id: categoryId },
      });

      if (!response.data?.url && response.data.data.length === 0) {
        setError("No patient photo found");
        return;
      }
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

  if (!patientImageUrl) {
    return (
      <EmptyStateComponent
        title="No Patient ID Photo"
        message="No ID photo is available for this patient."
        isAnyModalOpen={isAnyModalOpen}
      />
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Unable to Load Patient Photo"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching the photo."
        }
        icon="error"
        onRetry={fetchPatientPhoto}
      />
    );
  }

  const tabs = [{ label: "Patient ID Card" }, { label: "Photos" }];

  const renderTabContent = () => {
    if (activeTab === "Patient ID Card") {
      if (!patientImageUrl) {
        return (
          <EmptyStateComponent
            title="No Patient ID Photo"
            message="No ID photo is available for this patient."
          />
        );
      }
      return <PatientCard patientImage={patientImageUrl} />;
    } else if (activeTab === "Photos") {
      if (patientPhotos.length === 0) {
        return (
          <EmptyStateComponent
            title="No Photos Available"
            message="No additional photos are available for this patient."
          />
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