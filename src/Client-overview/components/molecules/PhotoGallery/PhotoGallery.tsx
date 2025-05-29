import React from "react";
import Icons from "../../../assets/Icons/Icons";

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
        <h2 className="text-sm font-normal text-[#020817]">Patient Photos</h2>
        <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#00B0F0]/50 focus-visible:ring-offset-2 border border-[#00B0F0] text-[#00B0F0] bg-white hover:bg-accent hover:text-accent-foreground h-7 rounded-md px-3 text-xs gap-1">
          <Icons variant="upload" />
          Upload New
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <div
            key={photo.id}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            <img src={photo.src} className="object-cover w-full h-48" />
            <span className="absolute px-2 py-1 text-xs font-light text-white bg-black rounded top-2 left-2"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;