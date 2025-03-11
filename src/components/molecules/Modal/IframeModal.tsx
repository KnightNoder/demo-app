import React, { useState, useEffect, useRef } from "react";

// Define the modal information interface
interface ModalInfo {
  isOpen: boolean;
  url: string;
  title: string;
  loading?: boolean;
}

// Create a dedicated IframeModal component
const IframeModal: React.FC<{
  modal: ModalInfo;
  closeModal: () => void;
}> = ({ modal, closeModal }) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Reset loading state when URL changes
  useEffect(() => {
    if (modal.url) {
      setIframeLoading(true);
    }
  }, [modal.url]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    
    if (modal.isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.isOpen, closeModal]);

  // Clean up iframe resources when modal closes
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        // Clear the iframe src when unmounting to free resources
        iframeRef.current.src = "about:blank";
      }
    };
  }, []);

  if (!modal.isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        // Close when clicking outside the modal content
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div 
        className="relative bg-white p-4 rounded-lg shadow-lg w-[80%] h-[80%] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">{modal.title}</h2>
          <button
            onClick={closeModal}
            className="text-lg text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        {/* Loading indicator */}
        {iframeLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Iframe with lazy loading */}
        <iframe
          ref={iframeRef}
          src={modal.url}
          className="flex-1 w-full rounded-md"
          title={`${modal.title} Frame`}
          onLoad={handleIframeLoad}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-forms"
          referrerPolicy="no-referrer"
        ></iframe>
      </div>
    </div>
  );
};

export default IframeModal;