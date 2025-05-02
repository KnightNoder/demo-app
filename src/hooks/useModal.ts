import { useState, useEffect } from "react";
import { ModalInfo } from "../types";
import { getCategoryUrl } from "../utils/urlHelpers";

/**
 * Simplified modal hook that directly responds to modal state changes
 */
export const useModal = () => {
  // State for any modal being open (affects z-index)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  // State for the primary modal
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    url: "",
    title: "",
  });

  // Listen for ALL modal state changes, from any source
  useEffect(() => {
    const handleModalStateChange = (
      event: CustomEvent<{ isOpen: boolean }>
    ) => {
      const { isOpen } = event.detail;
      // Direct update of the global modal state based on the event
      // This ensures isAnyModalOpen is always in sync with any modal's state
      setIsAnyModalOpen(isOpen);

      // If our main modal is open but we got a close event, close it as well
      if (!isOpen && modal.isOpen) {
        setModal({
          ...modal,
          isOpen: false,
        });
      }
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
  }, [modal]);

  // Function to open a modal
  const openModal = (category: string | null, patientId: string | null) => {
    const url = getCategoryUrl(category, patientId);

    if (!url) {
      console.warn(`No URL configured for category: ${category}`);
      return;
    }

    // Update our local modal state
    setModal({
      isOpen: true,
      url,
      title: category || "Content",
    });

    // Update the global modal state
    setIsAnyModalOpen(true);

    // Dispatch event to notify other components
    const event = new CustomEvent("modalStateChange", {
      detail: { isOpen: true },
    });
    document.dispatchEvent(event);
  };

  // Function to close a modal
  const closeModal = () => {
    // Update our local modal state
    setModal((prev) => ({ ...prev, isOpen: false }));

    // Update the global modal state
    setIsAnyModalOpen(false);

    // Dispatch event to notify other components
    const event = new CustomEvent("modalStateChange", {
      detail: { isOpen: false },
    });
    document.dispatchEvent(event);
  };

  return {
    modal,
    isAnyModalOpen,
    openModal,
    closeModal,
  };
};
