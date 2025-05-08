import React, { useEffect } from "react";
import IframeModal from "./IframeModal";
import { ModalInfo } from "../../../types";

interface AppModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

/**
 * Application modal component
 */
const AppModal: React.FC<AppModalProps> = ({ modal, closeModal }) => {
  // Handle keyboard events and notify about modal state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on pure Escape key press (no modifiers)
      if (
        e.key === "Escape" &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        closeModal();
      }

      // Close modal when developer tools are opened (Ctrl+Shift+I or F12)
      if ((e.ctrlKey && e.shiftKey && e.key === "I") || e.key === "F12") {
        // Close the modal
        handleClose();
      }
    };

    if (modal.isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      // Dispatch a custom event to notify that a modal is open
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: true },
      });
      document.dispatchEvent(modalOpenEvent);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Dispatch a custom event to notify that a modal is closed
      if (modal.isOpen) {
        const modalCloseEvent = new CustomEvent("modalStateChange", {
          detail: { isOpen: false },
        });
        document.dispatchEvent(modalCloseEvent);
      }
    };
  }, [modal.isOpen, closeModal]);

  // Handle the actual close action (used by both escape key and close button)
  const handleClose = () => {
    // Dispatch event to notify components that modal is closing
    const modalCloseEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: false },
    });
    document.dispatchEvent(modalCloseEvent);

    // Call the passed-in closeModal function
    closeModal();
  };

  // Also detect DevTools via the 'devtoolschange' event if available
  useEffect(() => {
    // Function to detect if DevTools is open
    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200
      ) {
        // DevTools is likely open, close the modal
        handleClose();
      }
    };

    // Event listener for resize (which happens when DevTools is opened/closed)
    window.addEventListener("resize", detectDevTools);

    // Check immediately
    detectDevTools();

    // Clean up
    return () => {
      window.removeEventListener("resize", detectDevTools);
    };
  }, [closeModal]);

  if (!modal.isOpen) return null;

  return (
    <div
      data-testid="app-modal"
      className="fixed inset-0 flex items-center justify-center bg-[#000000CC] z-120 modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Handle backdrop click
          handleClose();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white overflow-x-scroll p-4 rounded-lg shadow-lg w-[90%] max-w-[75%] h-[80%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 pr-10">
          <span id="modal-title" className="font-semibold">
            {modal.title}
          </span>
          <button
            data-testid="modal-close"
            onClick={(e) => {
              e.stopPropagation();
              // Use the same handler as escape key
              handleClose();
            }}
            className="focus:outline-none"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Iframe Content */}
        <IframeModal modal={modal} closeModal={handleClose} />
      </div>
    </div>
  );
};

export default AppModal;