import React, { useEffect, useRef } from "react";
import IframeModal from "./IframeModal";
import { ModalInfo } from "../../../../types";

interface AppModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

/**
 * Application modal component
 */
const AppModal: React.FC<AppModalProps> = ({ modal, closeModal }) => {
  // Using ref to track if we're intentionally closing
  const isClosingRef = useRef(false);

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
        // Set flag to indicate we're deliberately closing
        isClosingRef.current = true;
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

      // Only dispatch close event if we haven't already done so
      if (modal.isOpen && !isClosingRef.current) {
        const modalCloseEvent = new CustomEvent("modalStateChange", {
          detail: { isOpen: false },
        });
        document.dispatchEvent(modalCloseEvent);
      }
    };
  }, [modal.isOpen, closeModal]);

  // Handle the actual close action (used by both escape key and close button)
  const handleClose = () => {
    // Set flag to indicate we're deliberately closing
    isClosingRef.current = true;

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
    // Track the previous dimensions to avoid false positives
    const prev = {
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    };

    // Function to detect if DevTools is open
    const detectDevTools = () => {
      // Only consider significant changes to avoid false triggers
      const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
      const widthDiff = Math.abs(window.outerWidth - window.innerWidth);

      const prevHeightDiff = Math.abs(prev.outerHeight - prev.innerHeight);
      const prevWidthDiff = Math.abs(prev.outerWidth - prev.innerWidth);

      // Only trigger if there's a significant change in the differences
      if (
        (heightDiff > 200 && heightDiff - prevHeightDiff > 100) ||
        (widthDiff > 200 && widthDiff - prevWidthDiff > 100)
      ) {
        // DevTools is likely open, close the modal
        isClosingRef.current = true;
        handleClose();
      }

      // Update previous values
      prev.outerHeight = window.outerHeight;
      prev.outerWidth = window.outerWidth;
      prev.innerHeight = window.innerHeight;
      prev.innerWidth = window.innerWidth;
    };

    // Event listener for resize with debounce
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(detectDevTools, 300);
    };

    window.addEventListener("resize", handleResize);

    // Check immediately
    detectDevTools();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
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
