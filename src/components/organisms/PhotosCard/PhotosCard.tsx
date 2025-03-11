import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import PatientCard from "../../molecules/PatientCard/PatientCard";
import PhotoGalleryComponent from "../../molecules/PhotoGallery/PhotoGallery";

interface PhotosCardProps {
  patientId: string | null;
}

const PhotosCard: React.FC<PhotosCardProps> = ({ patientId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Patient ID Card");
  const patientPhotos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&amp;auto=format%22%20alt=%22Patient%20ID%20Photo",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&amp;auto=format%22%20alt=%22Patient%20ID%20Photo",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&amp;auto=format%22%20alt=%22Patient%20ID%20Photo",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&amp;auto=format%22%20alt=%22Patient%20ID%20Photo",
    },
  ];
  useEffect(() => {
    if (patientId) {
      setLoading(true);
      fetch(`https://qa-phoenix.drcloudemr.com/api/appointments/${patientId}/`)
        .then((response) => response.json())
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
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
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  const tabs = [{ label: "Patient ID Card" }, { label: "Photos" }];

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        {activeTab === "Patient ID Card" && <PatientCard />}
        {activeTab === "Photos" && (
          <PhotoGalleryComponent photos={patientPhotos} />
        )}
      </div>
    </div>
  );
};

export default PhotosCard;
