// index.tsx - WidgetMenu with fixes for whitespace
import React, { useState, useRef, useEffect } from "react";
import { getMenuItems, allMenuItems } from "./menuData";

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
  onModalStateChange?: (isOpen: boolean) => void; // Add prop for notifying parent of modal state
}

// Define the WidgetListProps interface for the WidgetList component
export interface WidgetListProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  authorizedWidgetOptions: WidgetOption[];
  visibleWidgets: string[];
  toggleWidget: (widgetKey: string) => void;
  widgetOptions: WidgetOption[];
  isMobileView: boolean;
  isSmallScreen: boolean;
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

  // Refs
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);

  // Get menu items
  const menuItems = getMenuItems(patientId);

  // Notify parent component when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(showModal);
    }
  }, [showModal, onModalStateChange]);

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

      // Only close the widget menu if no modal is open
      if (
        !modalIsOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWidgetMenuOpen(false);
        setShowDropdown(false);
        setShowModal(false);
        setShowMenuPanel(false);
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
      setDropdownPosition({
        top: rect.bottom + window.scrollY - 45,
        left: rect.left + window.scrollX,
      });
    }

    setShowDropdown(true);
  };

  // Handle dropdown item click
  const handleItemClick = (item: DropdownMenuItem) => {
    // Process the URL template if it needs processing
    let processedUrl = item.url;

    // If the URL is already processed by MenuButton, this won't be needed,
    // but we'll add it as a safeguard
    if (
      typeof processedUrl === "string" &&
      (processedUrl.includes("${import.meta.env.VITE_V1_URL}") ||
        processedUrl.includes("${patientId}"))
    ) {
      // Replace environment variable
      if (processedUrl.includes("${import.meta.env.VITE_V1_URL}")) {
        const baseUrl = import.meta.env.VITE_V1_URL || "/api";
        processedUrl = processedUrl.replace(
          "${import.meta.env.VITE_V1_URL}",
          baseUrl
        );
      }

      // Replace patientId
      if (processedUrl.includes("${patientId}")) {
        processedUrl = processedUrl.replace("${patientId}", patientId || "");
      }
    }

    setModalUrl(processedUrl);
    setModalTitle(`${activeButton} - ${item.label}`);
    setShowModal(true);
    setShowDropdown(false);
    setShowMenuPanel(false);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalUrl("");
  };

  // Toggle menu panel
  const toggleMenuPanel = () => {
    setShowMenuPanel(!showMenuPanel);
  };

  // Filter widget options to only show authorized widgets
  const authorizedWidgetOptions = widgetOptions.filter((widget) =>
    authorizedWidgets.includes(widget.key)
  );

  return (
    <div
      className={`relative ${isSmallScreen ? "flex items-center justify-between" : `flex ${isMobileView ? "justify-center" : "justify-end"}`} mx-auto ${isMobileView ? "px-4 mb-2" : "mb-4"} transform  ${isAnyModalOpen ? "z-10" : "z-50"}`}
      ref={widgetRef}
    >
      {/* Widgets button */}
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
          patientId={patientId} // Add this prop
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

      {/* Modal with iframe */}
      {showModal && (
        <ModalContent
          modalTitle={modalTitle}
          modalUrl={modalUrl}
          closeModal={closeModal}
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
        />
      </div>
    </div>
  );
};

export default WidgetMenu;