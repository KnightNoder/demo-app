import { useState, useEffect } from "react";
import useWidgetToast from "./useWidgetToast";
import { widgetOptions, defaultVisibleWidgets } from "../config/widgets";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";

// Define the interface for grid items
interface GridItem {
  id: string;
  order: number;
}

// ACL API Response interface
interface ACLResponse {
  widgets: {
    name: string;
    visible: boolean;
  }[];
  buttons: {
    name: string;
    visible: boolean;
  }[];
  user_flags: {
    is_strict_auditor: boolean;
  };
}

// JWT token decoded interface
interface DecodedToken {
  user_id: string;
  // add other fields as needed
}

// Define mandatory widgets that should always be visible
const mandatoryWidgets = ["Lab Reports", "Notifications", "Demographics"];

// Local storage keys
const WIDGET_POSITIONS_KEY = "widgetPositions";
const VISIBLE_WIDGETS_KEY = "visibleWidgets";

/**
 * Converts ACL name to widget key
 * Example: "notes" -> "Clinical Notes", "id_card_photos" -> "ID Card/Photos"
 */
const convertACLNameToWidgetKey = (aclName: string): string | null => {
  const mappings: Record<string, string> = {
    allergies: "Allergies",
    medical_problems: "Diagnosis",
    medications: "Medications",
    // notes: "Clinical Notes",
    insurance: "Insurance",
    lab_reports: "Lab Reports",
    prescriptions: "Prescriptions",
    documents: "Documents",
    appointments: "Appointments",
    notifications: "Notifications",
    demographics: "Demographics",
    id_card_photos: "ID Card/Photos",
    vitals: "Vitals",
    disclosures: "Disclosures",
    functional_status: "Functional Status",
    cognitive_status: "Cognitive Status",
    // advance_directives: "Advanced Directives",
  };

  return mappings[aclName] || null;
};

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const useWidgets = () => {
  // Get current user ID from JWT token for storage key
  let userId = "";
  try {
    const token = localStorage.getItem("JWT_AUTH_TOKEN");
    if (token) {
      const decoded = jwtDecode(token) as DecodedToken;
      userId = decoded.user_id;
    }
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
  }

  // Create user-specific local storage keys
  const userSpecificPositionsKey = userId
    ? `${WIDGET_POSITIONS_KEY}_${userId}`
    : WIDGET_POSITIONS_KEY;
  const userSpecificVisibleWidgetsKey = userId
    ? `${VISIBLE_WIDGETS_KEY}_${userId}`
    : VISIBLE_WIDGETS_KEY;

  // Try to load saved widget positions from localStorage
  const getSavedGridItems = (): GridItem[] | null => {
    if (!isLocalStorageAvailable()) return null;

    try {
      const savedGridItems = localStorage.getItem(userSpecificPositionsKey);
      if (savedGridItems) {
        return JSON.parse(savedGridItems);
      }
    } catch (e) {
      console.error("Failed to parse saved widget positions:", e);
    }
    return null;
  };

  // Try to load saved visible widgets from localStorage
  const getSavedVisibleWidgets = (): string[] | null => {
    if (!isLocalStorageAvailable()) return null;

    try {
      const savedWidgets = localStorage.getItem(userSpecificVisibleWidgetsKey);
      if (savedWidgets) {
        return JSON.parse(savedWidgets);
      }
    } catch (e) {
      console.error("Failed to parse saved visible widgets:", e);
    }
    return null;
  };

  // Initialize state with saved values or defaults
  const savedVisibleWidgets = getSavedVisibleWidgets();
  const initialVisibleWidgets = savedVisibleWidgets || [
    ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
  ];

  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(
    initialVisibleWidgets
  );

  // Initialize with all widgets as authorized by default
  const [authorizedWidgets, setAuthorizedWidgets] = useState<string[]>([
    ...new Set([...widgetOptions.map((opt) => opt.key), ...mandatoryWidgets]),
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize gridItems with saved positions or default order
  const savedGridItems = getSavedGridItems();
  const [gridItems, setGridItems] = useState<GridItem[]>(
    savedGridItems ||
      initialVisibleWidgets.map((widgetKey, index) => ({
        id: widgetKey,
        order: index,
      }))
  );

  const [isStrictAuditor, setIsStrictAuditor] = useState<boolean>(false);
  const { showWidgetToast } = useWidgetToast();

  // Save grid items to localStorage whenever they change
  useEffect(() => {
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.setItem(userSpecificPositionsKey, JSON.stringify(gridItems));
    } catch (e) {
      console.error("Failed to save widget positions:", e);
    }
  }, [gridItems, userSpecificPositionsKey]);

  // Save visible widgets to localStorage whenever they change
  useEffect(() => {
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.setItem(
        userSpecificVisibleWidgetsKey,
        JSON.stringify(visibleWidgets)
      );
    } catch (e) {
      console.error("Failed to save visible widgets:", e);
    }
  }, [visibleWidgets, userSpecificVisibleWidgetsKey]);

  // Fetch ACL permissions on mount
  useEffect(() => {
    const fetchACLPermissions = async () => {
      try {
        setLoading(true);

        // Get JWT token from local storage
        const token = localStorage.getItem("JWT_AUTH_TOKEN");
        if (!token) {
          console.warn("No JWT token found, using default widgets");
          // Use saved items or initialize new ones if none exist
          const initialWidgets = savedVisibleWidgets || [
            ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
          ];

          if (!savedGridItems) {
            initializeGridItems(initialWidgets);
          }

          setLoading(false);
          return;
        }

        // Decode token to get user_id
        const decoded = jwtDecode(token) as DecodedToken;
        const userId = decoded.user_id;

        // Fetch ACL matrix from API
        const response = await axiosClient.get(
          `/acl/ui-matrix?user_id=${userId}`
        );

        // Axios uses response.data instead of response.json()
        const aclData: ACLResponse = response.data;

        // Extract and set isStrictAuditor flag from the API response
        const strictAuditorFlag =
          aclData.user_flags?.is_strict_auditor || false;
        setIsStrictAuditor(strictAuditorFlag);

        // Get authorized widgets from ACL response (all widgets marked as visible)
        const aclAuthorizedWidgets: string[] = [];

        aclData.widgets.forEach((widget) => {
          if (widget.visible) {
            const widgetKey = convertACLNameToWidgetKey(widget.name);
            if (
              widgetKey &&
              widgetOptions.some((opt) => opt.key === widgetKey)
            ) {
              aclAuthorizedWidgets.push(widgetKey);
            }
          }
        });

        // If no authorized widgets were found, use the default list of widgets
        // This is for fallback safety only - in production, this should be handled according to security policy
        let finalAuthorizedWidgets =
          aclAuthorizedWidgets.length > 0
            ? aclAuthorizedWidgets
            : widgetOptions.map((opt) => opt.key);

        // Ensure mandatory widgets are always authorized
        finalAuthorizedWidgets = [
          ...new Set([...finalAuthorizedWidgets, ...mandatoryWidgets]),
        ];
        setAuthorizedWidgets(finalAuthorizedWidgets);

        // At this point we have authorized widgets from ACL

        // Use previously stored visibleWidgets if available, otherwise filter from current state
        let currentVisibleWidgets = visibleWidgets;

        // Filter currently visible widgets to only include authorized ones
        let filteredVisibleWidgets = currentVisibleWidgets.filter((widget) =>
          finalAuthorizedWidgets.includes(widget)
        );

        // Ensure mandatory widgets are always visible
        filteredVisibleWidgets = [
          ...new Set([...filteredVisibleWidgets, ...mandatoryWidgets]),
        ];

        // If no widgets are visible after filtering, use defaults (but only those that are authorized)
        let finalVisibleWidgets =
          filteredVisibleWidgets.length > 0
            ? filteredVisibleWidgets
            : defaultVisibleWidgets.filter((widget) =>
                finalAuthorizedWidgets.includes(widget)
              );

        // Ensure mandatory widgets are included in the final visible widgets
        finalVisibleWidgets = [
          ...new Set([...finalVisibleWidgets, ...mandatoryWidgets]),
        ];

        setVisibleWidgets(finalVisibleWidgets);

        // If we have saved grid items, filter them based on authorization
        if (savedGridItems) {
          const filteredGridItems = savedGridItems.filter((item) =>
            finalAuthorizedWidgets.includes(item.id)
          );

          // Ensure all visible widgets are in the grid items
          const missingWidgets = finalVisibleWidgets.filter(
            (widgetKey) =>
              !filteredGridItems.some((item) => item.id === widgetKey)
          );

          if (missingWidgets.length > 0) {
            // Add missing widgets to the end of the grid
            const nextOrder =
              filteredGridItems.length > 0
                ? Math.max(...filteredGridItems.map((item) => item.order)) + 1
                : 0;

            const newItems = [
              ...filteredGridItems,
              ...missingWidgets.map((widgetKey, idx) => ({
                id: widgetKey,
                order: nextOrder + idx,
              })),
            ];

            setGridItems(newItems);
          } else {
            setGridItems(filteredGridItems);
          }
        } else {
          // Initialize from scratch if no saved items
          initializeGridItems(finalVisibleWidgets);
        }
      } catch (err) {
        console.error("Error fetching ACL permissions:", err);
        setError("Failed to load widget permissions");
        // Ensure mandatory widgets are included even when there's an error
        const fallbackWidgets = savedVisibleWidgets || [
          ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
        ];

        if (!savedGridItems) {
          initializeGridItems(fallbackWidgets);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchACLPermissions();
  }, []);

  // Initialize grid items from visible widgets
  const initializeGridItems = (widgets: string[]) => {
    const items = widgets.map((widgetKey, index) => ({
      id: widgetKey,
      order: index,
    }));
    setGridItems(items);
  };

  const toggleWidget = (widgetKey: string) => {
    // Prevent toggling of mandatory widgets
    if (mandatoryWidgets.includes(widgetKey)) {
      console.warn(`Widget ${widgetKey} is mandatory and cannot be toggled`);
      return;
    }

    // Only allow toggling if the widget is authorized
    if (!authorizedWidgets.includes(widgetKey)) {
      console.warn(`Widget ${widgetKey} is not authorized by ACL`);
      return;
    }

    setVisibleWidgets((prevWidgets) => {
      const isAdding = !prevWidgets.includes(widgetKey);

      // Use the toast hook to show notifications
      showWidgetToast(widgetKey, isAdding);

      if (isAdding) {
        // Add the widget to the grid items with the next order number
        const newOrder = gridItems.length;
        setGridItems((prev) => [...prev, { id: widgetKey, order: newOrder }]);
        return [...prevWidgets, widgetKey];
      } else {
        // Remove the widget from grid items
        setGridItems((prev) => prev.filter((item) => item.id !== widgetKey));
        // Reorder remaining items
        setGridItems((prev) =>
          prev.map((item, index) => ({ ...item, order: index }))
        );
        return prevWidgets.filter((w) => w !== widgetKey);
      }
    });
  };

  return {
    visibleWidgets,
    setVisibleWidgets: (widgets: string[]) => {
      // Ensure mandatory widgets are always included when setting visible widgets programmatically
      const updatedWidgets = [...new Set([...widgets, ...mandatoryWidgets])];
      setVisibleWidgets(updatedWidgets);
    },
    authorizedWidgets, // Expose the list of authorized widgets
    gridItems,
    setGridItems,
    toggleWidget,
    loading,
    error,
    mandatoryWidgets, // Expose the list of mandatory widgets
    isStrictAuditor, // Expose the strict auditor flag
  };
};