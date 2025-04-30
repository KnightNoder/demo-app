import React, { useState, useEffect, useRef } from "react";

interface ModalInfo {
  isOpen: boolean;
  url: string;
  title: string;
  loading?: boolean;
}

const IframeModal: React.FC<{
  modal: ModalInfo;
  closeModal: () => void;
}> = ({ modal }) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (modal.url) {
      setIframeLoading(true);
    }
  }, [modal.url]);

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = "about:blank";
      }
    };
  }, []);

  // Just return the iframe content without creating another modal container
  return (
    <div className="relative flex-1 w-full h-full overflow-hidden">
      {iframeLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={modal.url}
        className="absolute inset-0 w-full h-full"
        title={`${modal.title} Frame`}
        onLoad={handleIframeLoad}
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms"
        referrerPolicy="no-referrer"
      ></iframe>
    </div>
  );
};

export default IframeModal;