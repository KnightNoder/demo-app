// components/ModalContent.tsx
import React from 'react';

interface ModalContentProps {
  modalTitle: string;
  modalUrl: string;
  closeModal: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalTitle,
  modalUrl,
  closeModal
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{modalTitle}</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
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
        <div className="flex-1 p-4">
          <iframe
            src={modalUrl}
            className="w-full h-full border-0"
            title="Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalContent;