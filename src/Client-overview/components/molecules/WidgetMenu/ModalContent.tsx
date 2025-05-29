import React, { useEffect } from "react";

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
  // Handle escape key and add modal-open class to body
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    // Add the modal-open class to body
    document.body.classList.add("modal-open");

    // Add event listener for escape key
    document.addEventListener("keydown", handleEscKey);

    // Dispatch event to notify other components that a modal is open
    const modalOpenEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: true },
    });
    document.dispatchEvent(modalOpenEvent);

    // Cleanup function
    return () => {
      // Remove modal-open class from body
      document.body.classList.remove("modal-open");

      // Remove event listener
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal">
      <div className="bg-white rounded-lg shadow-lg w-[95%] md:w-4/5 lg:w-3/4 h-[95%] md:h-4/5 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">{modalTitle}</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
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

        {/* Modal Content */}
        <div className="flex-grow p-0">
          <iframe
            src={modalUrl}
            title={modalTitle}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
