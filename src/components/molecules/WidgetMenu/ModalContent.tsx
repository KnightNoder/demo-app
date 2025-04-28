import React, { useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";

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
  // When component mounts, dispatch modal open event
  useEffect(() => {
    // Dispatch event to notify other components that iframe modal is open
    const modalOpenEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: true },
    });
    document.dispatchEvent(modalOpenEvent);

    // Cleanup when component unmounts
    return () => {
      // No need to dispatch close event here as it's handled by handleClose
    };
  }, []);

  // Properly handle modal closure to maintain state tracking
  const handleClose = () => {
    // First, dispatch a dedicated iframe modal closed event
    // This allows other components to differentiate between iframe and other modals
    const iframeEvent = new CustomEvent("iframeModalClosed", {});
    document.dispatchEvent(iframeEvent);

    // Then dispatch the standard modal state change event, but with a slight delay
    // to ensure proper handling order in parent components
    setTimeout(() => {
      const modalCloseEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: false },
      });
      document.dispatchEvent(modalCloseEvent);

      // Finally call the closeModal function provided by parent
      closeModal();
    }, 0);
  };

  // Handle ESC key press and clicks outside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside the modal content
      const modalContent = document.querySelector(".bg-white.w-11\\/12");
      if (modalContent && !modalContent.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      data-modal-type="iframe"
      // We let handleClickOutside in useEffect handle this for better event coordination
    >
      <div
        className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on modal content from closing
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">{modalTitle}</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
            data-testid="iframe-modal-close"
          >
            <Icons variant="close" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={modalUrl}
            className="w-full h-full border-0"
            title={modalTitle}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalContent;