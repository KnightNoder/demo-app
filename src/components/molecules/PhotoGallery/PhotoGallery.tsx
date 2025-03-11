import React from "react";

type Photo = {
  id: number;
  src: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Patient Photos</h2>
        <button className="flex items-center px-4 py-2 text-sm text-white bg-blue-500 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Upload New
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-md">
            <img
              src={photo.src}
              className="object-cover w-full h-48"
            />
            <span className="absolute px-2 py-1 text-xs text-white bg-black rounded top-2 left-2">
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;