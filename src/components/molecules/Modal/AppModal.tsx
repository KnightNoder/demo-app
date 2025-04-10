import React from 'react';
import IframeModal from './IframeModal';
import { ModalInfo } from '../../../types';

interface AppModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

/**
 * Application modal component
 */
const AppModal: React.FC<AppModalProps> = ({ modal, closeModal }) => {
  if (!modal.isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-50 modal backdrop-blur-sm"
      onClick={(e) => {
        // Stop propagation to prevent any other handlers from firing
        e.stopPropagation();
        closeModal();
      }}
    >
      <div
        className="relative bg-white p-2 md:p-4 rounded-lg shadow-lg w-[90%] md:w-4/5 h-[90%] md:h-4/5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <h2 className="text-lg font-semibold md:text-xl">
            {modal.title}
          </h2>
          <button
            onClick={closeModal}
            className="text-lg text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            ✖
          </button>
        </div>
        
        <IframeModal modal={modal} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default AppModal;