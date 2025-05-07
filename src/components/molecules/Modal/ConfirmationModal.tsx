import React, { useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";

interface ResetConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isResetting: boolean;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  isResetting
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl"
      >
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 mr-4 bg-red-100 rounded-full">
            <Icons variant="alert" className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Reset Widget Layout</h3>
        </div>
        
        <p className="mb-6 text-gray-700">
          Are you sure you want to reset your widget layout to the default configuration? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isResetting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isResetting}
            className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              isResetting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {isResetting ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resetting...
              </div>
            ) : (
              "Reset Layout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;