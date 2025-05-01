import React, { useEffect, useRef } from "react";
import { ModalInfo } from "../../../types";

interface IframeModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

const IframeModal: React.FC<IframeModalProps> = ({ modal, closeModal }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle communication from the iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      // Check for close message from iframe
      if (event.data && event.data.action === "closeModal") {
        // Call the closeModal function passed as prop
        closeModal();

        // Also dispatch a specific iframe modal closed event
        const iframeEvent = new CustomEvent("iframeModalClosed", {});
        document.dispatchEvent(iframeEvent);

        // Dispatch the standard modal state change event
        const modalEvent = new CustomEvent("modalStateChange", {
          detail: { isOpen: false },
        });
        document.dispatchEvent(modalEvent);
      }
    };

    // Add the event listener for iframe messages
    window.addEventListener("message", handleIframeMessage);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [closeModal]);

  // Fixed height with flex to ensure the iframe fills the container
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {modal.url && (
        <iframe
          ref={iframeRef}
          src={modal.url}
          className="w-full h-full border-0"
          title={modal.title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
};

export default IframeModal;
