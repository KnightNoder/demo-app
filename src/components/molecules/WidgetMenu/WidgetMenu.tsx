import React, { useState, useRef, useEffect } from "react";
import { getMenuItems, allMenuItems, getProcessedUrl } from "./menuData";
// import { getBaseUrl } from "./menuData"; // Import getBaseUrl

// Define the dropdown-related interfaces
export interface DropdownMenuItem {
  label: string;
  url: string;
}

export interface DropdownPosition {
  top: number;
  left: number;
}

import { WidgetOption } from "../../../config/widgets";

// Define the WidgetMenuProps interface
export interface WidgetMenuProps {
  widgetOptions: WidgetOption[];
  visibleWidgets: string[];
  authorizedWidgets: string[];
  toggleWidget: (widgetKey: string) => void;
  isWidgetMenuOpen: boolean;
  setIsWidgetMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileView: boolean;
  isAnyModalOpen: boolean;
  patientId: string | null;
  onModalStateChange?: (isOpen: boolean) => void;
  setIsExpandAll: React.Dispatch<React.SetStateAction<boolean>>;
}

// Import subcomponents
import WidgetsButton from "./WidgetsButton";
import MenuButton from "./MenuButton";
import MenuStrip from "./MenuStrip";
import DropdownMenu from "./DropdownMenu";
import ModalContent from "./ModalContent";
import WidgetList from "./WidgetList";

/**
 * Widget selection menu component with reduced whitespace for mobile view
 */
const WidgetMenu: React.FC<WidgetMenuProps> = ({
  widgetOptions,
  visibleWidgets,
  authorizedWidgets,
  toggleWidget,
  isWidgetMenuOpen,
  setIsWidgetMenuOpen,
  isMobileView,
  isAnyModalOpen,
  patientId,
  onModalStateChange,
  setIsExpandAll,
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownItems, setDropdownItems] = useState<DropdownMenuItem[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [showMenuPanel, setShowMenuPanel] = useState<boolean>(false);
  // const [isTestPatient, setIsTestPatient] = useState<boolean>(false);

  // Track different modal types
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState<boolean>(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState<boolean>(false);

  // Refs
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const widgetMenuDropdownRef = useRef<HTMLDivElement | null>(null);

  // Unique identifier for this component
  const widgetMenuId = "widget-menu";

  // Get menu items
  const menuItems = getMenuItems(patientId);

  // Handle test patient checkbox change
  // const handleTestPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = e.target.checked;

  //   // Create message based on checkbox state
  //   const message = newValue
  //     ? "Are you sure you want to mark this Patient as Test Patient?"
  //     : "Are you sure you want to mark this Patient as Live Patient?";

  //   // Show confirmation dialog
  //   if (window.confirm(message)) {
  //     // Make the API call if user confirms
  //     updatePatientStatus(newValue);

  //     // Update state if the API call doesn't fail
  //     setIsTestPatient(newValue);
  //   } else {
  //     // Revert checkbox if user cancels
  //     e.target.checked = !newValue;
  //   }
  // };

  // const updatePatientStatus = async (isTest: boolean) => {
  //   if (!patientId) {
  //     console.error("Patient ID is missing");
  //     return;
  //   }

  //   try {
  //     const baseUrl = getBaseUrl();
  //     const markValue = isTest ? 1 : 0;
  //     const url = `${baseUrl}/interface/patient_file/summary/ajax_update_patient_status.php?patid=${patientId}&mark_test_patient=${markValue}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update patient status");
  //     }

  //     console.log("Patient status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating patient status:", error);
  //     // Handle error - maybe show a notification
  //     alert("Failed to update patient status. Please try again.");

  //     // Revert the checkbox state on failure
  //     setIsTestPatient(!isTest);
  //   }
  // };

  // Listen for global modal state changes
  useEffect(() => {
    const handleGlobalModalStateChange = (
      event: CustomEvent<{
        isOpen: boolean;
        modalType?: string;
        sourceId?: string;
      }>
    ) => {
      const { isOpen, modalType, sourceId } = event.detail;

      // Skip processing events from this component to avoid loops
      if (!sourceId || sourceId !== widgetMenuId) {
        if (!isOpen) {
          // When any modal is closed, update all local modal states
          setIsHeaderModalOpen(false);
          setIsFooterModalOpen(false);
          setShowModal(false);

          // Also notify parent component
          if (onModalStateChange) {
            onModalStateChange(false);
          }
        } else if (modalType) {
          // Update specific modal state based on type
          switch (modalType) {
            case "header":
              setIsHeaderModalOpen(true);
              break;
            case "footer":
              setIsFooterModalOpen(true);
              break;
            default:
              // For other modals, just update the showModal state
              setShowModal(true);
          }

          // Also notify parent component
          if (onModalStateChange) {
            onModalStateChange(true);
          }
        }
      }
    };

    document.addEventListener(
      "modalStateChange",
      handleGlobalModalStateChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "modalStateChange",
        handleGlobalModalStateChange as EventListener
      );
    };
  }, [onModalStateChange]);

  // Notify parent component when any modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      const isAnyLocalModalOpen =
        showModal || isHeaderModalOpen || isFooterModalOpen;
      onModalStateChange(isAnyLocalModalOpen);
    }
  }, [showModal, isHeaderModalOpen, isFooterModalOpen, onModalStateChange]);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 943);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Click outside and escape handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if a modal is currently open
      const modalIsOpen = document.querySelector(".modal");

      // Handle widget menu dropdown close
      const widgetsButton = document.getElementById("widgets-toggle-button");
      const isClickOnWidgetsButton = widgetsButton?.contains(
        event.target as Node
      );

      if (
        isWidgetMenuOpen &&
        !modalIsOpen &&
        !isClickOnWidgetsButton &&
        !widgetMenuDropdownRef.current?.contains(event.target as Node)
      ) {
        setIsWidgetMenuOpen(false);
      }

      // Close dropdown when clicking outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[role="menuitem"]') &&
        !(event.target as HTMLElement).closest("#menu-panel")
      ) {
        setShowDropdown(false);
      }

      // Close menu panel when clicking outside
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("#menu-toggle-button")
      ) {
        setShowMenuPanel(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        setIsWidgetMenuOpen(false);
        setShowDropdown(false);
        setShowModal(false);
        setShowMenuPanel(false);
        setIsHeaderModalOpen(false);
        setIsFooterModalOpen(false);

        // Notify other components about modal closing
        const modalCloseEvent = new CustomEvent("modalStateChange", {
          detail: {
            isOpen: false,
            sourceId: widgetMenuId,
          },
        });
        document.dispatchEvent(modalCloseEvent);

        // Remove focus from any elements to prevent focus outline
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWidgetMenuOpen, setIsWidgetMenuOpen]);

  // Handle button click to show dropdown
  const handleButtonClick = (
    buttonName: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActiveButton(buttonName);
    setDropdownItems(menuItems[buttonName]);

    const rect = e.currentTarget.getBoundingClientRect();

    // Different positioning logic for small screens
    if (isSmallScreen) {
      // For accordion style, position is handled within the MenuButton component
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: window.innerWidth - 280,
      });
    } else {
      // Calculate base position for dropdown
      let leftPosition = rect.left + window.scrollX - 40;

      // Ensure dropdown doesn't go off screen (basic check, dropdown component has more comprehensive logic)
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      if (leftPosition + dropdownWidth > window.innerWidth - 20) {
        leftPosition = window.innerWidth - dropdownWidth - 20;
      }

      setDropdownPosition({
        top: rect.bottom + window.scrollY - 45,
        left: leftPosition,
      });
    }

    setShowDropdown(true);
  };

  // Handle dropdown item click - Updated to use centralized URL processing
  const handleItemClick = (item: DropdownMenuItem) => {
    // For special actions like Expand/Collapse All
    if (item.label === "Expand All") {
      setIsExpandAll(true);
      return;
    } else if (item.label === "Collapse All") {
      setIsExpandAll(false);
      return;
    }
    if (item.url === "#") {
      return;
    }
    // For all other URLs, try to open in modal
    try {
      // Use the centralized URL processing function
      const processedUrl = getProcessedUrl(item.url, patientId);

      setModalUrl(processedUrl);
      setModalTitle(`${activeButton} - ${item.label}`);
      setShowModal(true);
      setShowDropdown(false);
      setShowMenuPanel(false);

      // Dispatch a custom event to notify other components that this modal is open
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: {
          isOpen: true,
          modalType: "menu",
          sourceId: widgetMenuId,
        },
      });
      document.dispatchEvent(modalOpenEvent);
    } catch (error) {
      console.error("Error processing URL for modal:", error);
    }
  };

  // Close modal - FIX: Properly dispatch event to notify parent components
  const closeModal = () => {
    setShowModal(false);
    setModalUrl("");

    // Dispatch a custom event to notify other components that this modal is closed
    const event = new CustomEvent("modalStateChange", {
      detail: {
        isOpen: false,
        sourceId: widgetMenuId,
      },
    });
    document.dispatchEvent(event);
  };

  // Toggle menu panel
  const toggleMenuPanel = () => {
    setShowMenuPanel(!showMenuPanel);
  };

  // Filter widget options to only show authorized widgets
  const authorizedWidgetOptions = widgetOptions.filter((widget) =>
    authorizedWidgets.includes(widget.key)
  );

  // Determine if any modal is open (either local or passed down)
  const isAnyLocalModalOpen =
    isHeaderModalOpen || isFooterModalOpen || showModal;

  return (
    <>
      {/* <div className="flex items-center justify-between px-4 ml-20"> */}
      {/* <div className="flex items-center"> */}
      {/* <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="test-patient"
              checked={isTestPatient}
              onChange={handleTestPatientChange}
              className="mr-2 h-4 w-4"
            />
            <span>Test patient</span>
          </label> */}
      {/* </div> */}
      <div
        className={`relative ${isSmallScreen ? "flex items-center justify-between" : `flex ${isMobileView ? "justify-center" : "justify-end"}`} mx-0 md:mx-[0px] lg:mx-[30px] ${isMobileView ? "px-4 mb-2" : "mb-4"} transform  ${isAnyModalOpen || isAnyLocalModalOpen ? "z-10" : "z-11"}`}
        ref={widgetRef}
      >
        {/* Widgets button */}
        <>
          <WidgetsButton
            isWidgetMenuOpen={isWidgetMenuOpen}
            setIsWidgetMenuOpen={setIsWidgetMenuOpen}
          />
          {/* Menu toggle button for small screens or full menu strip for large screens */}
          {isSmallScreen ? (
            <MenuButton
              showMenuPanel={showMenuPanel}
              toggleMenuPanel={toggleMenuPanel}
              menuPanelRef={menuPanelRef}
              allMenuItems={allMenuItems}
              handleButtonClick={handleButtonClick}
              setShowMenuPanel={setShowMenuPanel}
              activeButton={activeButton}
              dropdownItems={dropdownItems}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              handleItemClick={handleItemClick}
              patientId={patientId}
            />
          ) : (
            <MenuStrip
              allMenuItems={allMenuItems}
              activeButton={activeButton}
              showDropdown={showDropdown}
              handleButtonClick={handleButtonClick}
            />
          )}
          {/* Dropdown Menu - only show for large screens */}
          {showDropdown && !isSmallScreen && (
            <DropdownMenu
              activeButton={activeButton}
              dropdownItems={dropdownItems}
              dropdownPosition={dropdownPosition}
              dropdownRef={dropdownRef}
              isSmallScreen={isSmallScreen}
              handleItemClick={handleItemClick}
              setShowDropdown={setShowDropdown}
            />
          )}
          {/* Widget menu dropdown with reduced spacing for mobile */}
          <div
            className={`absolute top-full ${isMobileView ? "" : isSmallScreen ? "right-0 left-0 mx-auto" : "right-[380px]"} mt-1 p-2 bg-white rounded-md shadow-lg transition-transform duration-300 ${
              isWidgetMenuOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            } ${isMobileView ? "w-[95%] left-0 right-0 mx-auto" : isSmallScreen ? "w-[400px] mx-auto" : "w-[500px]"}`}
            style={{ zIndex: 1000 }}
            ref={widgetMenuDropdownRef}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
          >
            <WidgetList
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              authorizedWidgetOptions={authorizedWidgetOptions}
              visibleWidgets={visibleWidgets}
              toggleWidget={toggleWidget}
              widgetOptions={widgetOptions}
              isMobileView={isMobileView}
              isSmallScreen={isSmallScreen}
              setIsExpandAll={setIsExpandAll}
            />
          </div>
        </>
      </div>
      {/* </div> */}
      {showModal && (
        <ModalContent
          modalTitle={modalTitle}
          modalUrl={modalUrl}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default WidgetMenu;