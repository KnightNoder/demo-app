import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking all modal states in the application
 */
export const useModalState = () => {
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  
  // Any modal is open if any of the individual modals are open
  const isAnyModalOpen = isHeaderModalOpen || isFooterModalOpen || isMenuModalOpen;
  
  // Listen for modal state changes from any component
  useEffect(() => {
    const handleModalStateChange = (event: CustomEvent<{ isOpen: boolean, modalType?: string }>) => {
      const { isOpen, modalType } = event.detail;
      
      if (!isOpen) {
        // When a modal is closed, reset all states
        setIsHeaderModalOpen(false);
        setIsFooterModalOpen(false);
        setIsMenuModalOpen(false);
      } else if (modalType) {
        // Update specific modal state based on type
        switch (modalType) {
          case 'header':
            setIsHeaderModalOpen(true);
            break;
          case 'footer':
            setIsFooterModalOpen(true);
            break;
          case 'menu':
            setIsMenuModalOpen(true);
            break;
          default:
            // For unknown types, just set all to true to be safe
            setIsMenuModalOpen(true);
            break;
        }
      } else {
        // If no type is specified but modal is open, assume it's a menu modal
        setIsMenuModalOpen(true);
      }
    };
    
    document.addEventListener(
      'modalStateChange',
      handleModalStateChange as EventListener
    );
    
    return () => {
      document.removeEventListener(
        'modalStateChange',
        handleModalStateChange as EventListener
      );
    };
  }, []);
  
  // Function to close all modals
  const closeAllModals = () => {
    setIsHeaderModalOpen(false);
    setIsFooterModalOpen(false);
    setIsMenuModalOpen(false);
    
    // Dispatch an event to notify all components
    const closeEvent = new CustomEvent("modalStateChange", {
      detail: { isOpen: false }
    });
    document.dispatchEvent(closeEvent);
  };
  
  return {
    isHeaderModalOpen,
    isFooterModalOpen,
    isMenuModalOpen,
    isAnyModalOpen,
    setIsHeaderModalOpen,
    setIsFooterModalOpen,
    setIsMenuModalOpen,
    closeAllModals
  };
};