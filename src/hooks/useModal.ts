import { useState, useEffect, useRef } from "react";
import { ModalInfo } from "../types";
import { getCategoryUrl } from "../utils/urlHelpers";

/**
 * Custom hook to manage modals with improved state tracking
 */
export const useModal = () => {
  // Reference to track active modal count
  const activeModalCount = useRef<number>(0);

  // State for any modal being open (affects z-index)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  // State for the primary modal
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

      // Track modal count to handle nested modals properly
      if (isOpen) {
        activeModalCount.current += 1;
        setIsAnyModalOpen(true);
      } else {
        activeModalCount.current = Math.max(0, activeModalCount.current - 1);
        // Only set isAnyModalOpen to false when all modals are closed
        if (activeModalCount.current === 0 && !modal.isOpen) {
          setIsAnyModalOpen(false);
        }
      }

      console.log(
        `Modal state changed: isOpen=${isOpen}, activeCount=${activeModalCount.current}`
      );
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
  }, [modal.isOpen]);

  // Function to open a modal
  const openModal = (category: string | null, patientId: string | null) => {
    const url = getCategoryUrl(category, patientId);
    console.log(url, "URL for add");

    if (!url) {
      console.warn(`No URL configured for category: ${category}`);
      return;
    }

    // Increment active modal count
    activeModalCount.current += 1;

    setModal({
      isOpen: true,
      url,
      title: category || "Content",
    });

    setIsAnyModalOpen(true);

    // Dispatch event for consistency
    const modalOpenEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: true },
    });
    document.dispatchEvent(modalOpenEvent);
  };

  // Function to close a modal
  const closeModal = () => {
    // Decrement active modal count
    activeModalCount.current = Math.max(0, activeModalCount.current - 1);

    // Update primary modal state
    setModal((prev) => ({ ...prev, isOpen: false }));

    // Only set global modal state to closed if no modals are open
    if (activeModalCount.current === 0) {
      setIsAnyModalOpen(false);

      // Dispatch event to notify other components
      const modalCloseEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: false },
      });
      document.dispatchEvent(modalCloseEvent);
    }
  };

  return {
    modal,
    isAnyModalOpen,
    openModal,
    closeModal,
  };
};
