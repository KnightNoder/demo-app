import { useState, useEffect } from 'react';
import { ModalInfo } from '../types';
import { getCategoryUrl } from '../utils/urlHelpers';

/**
 * Custom hook to manage modals
 */
export const useModal = () => {
  // State for any modal being open (affects z-index)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  
  // State for the modal
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    url: "",
    title: "",
  });

  // Listen for modal state changes from external components
  useEffect(() => {
    const handleModalStateChange = (
      event: CustomEvent<{ isOpen: boolean }>
    ) => {
      const { isOpen } = event.detail;
      setIsAnyModalOpen(isOpen);
    };

    document.addEventListener(
      "modalStateChange",
      handleModalStateChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "modalStateChange",
        handleModalStateChange as EventListener
      );
    };
  }, []);

  // Function to open a modal
  const openModal = (category: string | null, patientId: string | null) => {
    const url = getCategoryUrl(category, patientId);
    if (!url) {
      console.warn(`No URL configured for category: ${category}`);
      return;
    }

    setModal({
      isOpen: true,
      url,
      title: category || "Content",
    });
  };

  // Function to close a modal
  const closeModal = () => {
    // First dispatch the event before changing the state
    const modalCloseEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: false },
    });
    document.dispatchEvent(modalCloseEvent);

    // Then update the modal state
    setModal((prev) => ({ ...prev, isOpen: false }));

    // Ensure the widget ref z-index is reset by directly setting state
    setIsAnyModalOpen(false);
  };

  return {
    modal,
    isAnyModalOpen,
    openModal,
    closeModal
  };
};