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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
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

  if (!modal.isOpen) return null;

  return (
    <div
      data-testid="app-modal"
      className="fixed inset-0 flex items-center justify-center bg-[#000000CC] z-120 modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Handle backdrop click the same way as Escape key
          const modalCloseEvent = new CustomEvent("modalStateChange", {
            detail: { isOpen: false },
          });
          document.dispatchEvent(modalCloseEvent);
          closeModal();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-[50%] h-[80%] flex flex-col"
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
              // Handle close button click the same way as Escape key
              const modalCloseEvent = new CustomEvent("modalStateChange", {
                detail: { isOpen: false },
              });
              document.dispatchEvent(modalCloseEvent);
              closeModal();
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
        <IframeModal modal={modal} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default AppModal;
