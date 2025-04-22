import { useState, useEffect } from "react";
import useWidgetToast from "./useWidgetToast";
import { widgetOptions, defaultVisibleWidgets } from "../config/widgets"; // Update this import path
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

/**
 * Converts ACL name to widget key
 * Example: "notes" -> "Clinical Notes", "id_card_photos" -> "ID/Card Photos"
 */
const convertACLNameToWidgetKey = (aclName: string): string | null => {
  const mappings: Record<string, string> = {
    allergies: "Allergies",
    medical_problems: "Diagnosis",
    medications: "Medications",
    notes: "Clinical Notes",
    insurance: "Insurance",
    lab_reports: "Lab Reports",
    prescriptions: "Prescriptions",
    documents: "Documents",
    appointments: "Appointments",
    notifications: "Notifications",
    demographics: "Demographics",
    id_card_photos: "ID/Card Photos",
    vitals: "Vitals",
    disclosures: "Disclosures",
    functional_status: "Functional Status",
    cognitive_status: "Cognitive Status",
    advance_directives: "Advanced Directives",
  };

  return mappings[aclName] || null;
};

export const useWidgets = () => {
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(
    [...new Set([...defaultVisibleWidgets, ...mandatoryWidgets])] // Ensure mandatory widgets are included by default
  );
  // New state to track all authorized widgets from ACL
  const [authorizedWidgets, setAuthorizedWidgets] = useState<string[]>(
    [...new Set([...widgetOptions.map((opt) => opt.key), ...mandatoryWidgets])] // Ensure mandatory widgets are always authorized
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  // Add isStrictAuditor state
  const [isStrictAuditor, setIsStrictAuditor] = useState<boolean>(false);
  const { showWidgetToast } = useWidgetToast();

  // Fetch ACL permissions on mount
  useEffect(() => {
    const fetchACLPermissions = async () => {
      console.log("fetch matrix api");
      
      try {
        setLoading(true);

        // Get JWT token from local storage
        const token = localStorage.getItem("JWT_AUTH_TOKEN");
        if (!token) {
          console.warn("No JWT token found, using default widgets");
          // Ensure mandatory widgets are included when initializing
          const initialWidgets = [
            ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
          ];
          initializeGridItems(initialWidgets);
          setLoading(false);
          return;
        }

        // Decode token to get user_id
        const decoded = jwtDecode(token) as DecodedToken;
        const userId = decoded.user_id;
        console.log(userId, "User ID");

        // Fetch ACL matrix from API
        const response = await axiosClient.get(
          `/acl/ui-matrix?user_id=${userId}`
        );

        // Axios uses response.data instead of response.json()
        const aclData: ACLResponse = response.data;
        console.log(aclData, "ACL Data");

        // Extract and set isStrictAuditor flag from the API response
        const strictAuditorFlag =
          aclData.user_flags?.is_strict_auditor || false;
        setIsStrictAuditor(strictAuditorFlag);
        console.log("Is Strict Auditor:", strictAuditorFlag);

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

        // Filter currently visible widgets to only include authorized ones
        let filteredVisibleWidgets = visibleWidgets.filter((widget) =>
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
        initializeGridItems(finalVisibleWidgets);
      } catch (err) {
        console.error("Error fetching ACL permissions:", err);
        setError("Failed to load widget permissions");
        // Ensure mandatory widgets are included even when there's an error
        const fallbackWidgets = [
          ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
        ];
        initializeGridItems(fallbackWidgets);
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