import React, { useEffect, useRef } from "react";
import { ModalInfo } from "../../../types";

interface IframeModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

const IframeModal: React.FC<IframeModalProps> = ({ modal, closeModal }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to hide the cancel button in the iframe
  const hideCancelButton = () => {
    try {
      const iframe = iframeRef.current;

      if (!iframe || !iframe.contentDocument) {
        console.log("Cannot access iframe content yet");
        return false;
      }

      // Target the specific cancel button
      const cancelButton = iframe.contentDocument.querySelector(
        'input[type="button"][value="Cancel"]'
      );

      if (cancelButton) {
        (cancelButton as HTMLElement).style.display = "none";
        console.log("Cancel button hidden successfully");
        return true;
      } else {
        console.log("Cancel button not found in iframe");
        return false;
      }
    } catch (error) {
      console.error("Error hiding cancel button in iframe:", error);
      return false;
    }
  };

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

  // Set up listeners to hide the cancel button when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    // Try to hide the button when the iframe loads
    const handleLoad = () => {
      // First attempt
      if (!hideCancelButton()) {
        // If not successful, try again after a slight delay
        // to ensure the iframe content is fully rendered
        setTimeout(hideCancelButton, 500);
      }

      // Set up a MutationObserver to handle dynamically loaded content
      try {
        if (iframe.contentDocument) {
          const observer = new MutationObserver(() => {
            hideCancelButton();
          });

          observer.observe(iframe.contentDocument.body, {
            childList: true,
            subtree: true,
          });

          // Return cleanup function
          return () => observer.disconnect();
        }
      } catch (error) {
        console.error("Error setting up mutation observer:", error);
      }
    };

    // Add load event listener
    iframe.addEventListener("load", handleLoad);

    // Try immediately in case iframe is already loaded
    setTimeout(hideCancelButton, 100);

    // Cleanup
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [modal.url]); // Dependency on modal.url ensures this runs when the iframe src changes

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