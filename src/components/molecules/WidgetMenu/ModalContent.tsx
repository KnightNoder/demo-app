// components/ModalContent.tsx
import React, { useEffect, useState } from "react";

interface ModalContentProps {
  modalTitle: string;
  modalUrl: string;
  closeModal: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalTitle,
  modalUrl,
  closeModal,
}) => {
  const [iframeUrl, setIframeUrl] = useState<string>("");

  // Process the URL when modalUrl changes
  useEffect(() => {
    // Set the processed URL to state to ensure reactivity
    setIframeUrl(modalUrl);

    // Log the URL for debugging purposes
    console.log("Modal URL set to:", modalUrl);
  }, [modalUrl]);

  // Prevent scrolling but maintain visual appearance
  useEffect(() => {
    // Store original overflow
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;

    // Get current scroll position
    const scrollY = window.scrollY;

    // Prevent scrolling while keeping the page visually in the same position
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Add modal open class
    document.body.classList.add("modal-open");

    // Cleanup function
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.classList.remove("modal-open");

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000CC] z-120 modal h-[100vh] md:h-[100vh]">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center p-4 ">
          <h3 className="text-lg font-medium">{modalTitle}</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Content"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onError={(e) => console.error("Iframe loading error:", e)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading content...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalContent;