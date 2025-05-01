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

// API response interfaces
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

// Widget preferences API response
interface WidgetPreferencesResponse {
  positions: GridItem[];
  visible_widgets: string[];
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

export const useWidgets = () => {
  // State for widgets data
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(
    [...new Set([...defaultVisibleWidgets, ...mandatoryWidgets])]
  );
  
  const [authorizedWidgets, setAuthorizedWidgets] = useState<string[]>(
    [...new Set([...widgetOptions.map((opt) => opt.key), ...mandatoryWidgets])]
  );
  
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [isStrictAuditor, setIsStrictAuditor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // For API request debouncing
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { showWidgetToast } = useWidgetToast();
  
  // Function to get current user ID
  const getUserId = (): string => {
    try {
      const token = localStorage.getItem("JWT_AUTH_TOKEN");
      if (token) {
        const decoded = jwtDecode(token) as DecodedToken;
        return decoded.user_id;
      }
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
    }
    return "";
  };

  // API functions for widget preferences
  const fetchWidgetPreferences = async (): Promise<WidgetPreferencesResponse | null> => {
    try {
      const userId = getUserId();
      if (!userId) return null;
      
      const response = await axiosClient.get(`/widget-preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch widget preferences:", error);
      return null;
    }
  };

  const saveWidgetPreferences = async (
    positions: GridItem[], 
    visible: string[]
  ): Promise<boolean> => {
    try {
      const userId = getUserId();
      if (!userId) return false;
      
      await axiosClient.post(`/widget-preferences/${userId}`, {
        positions: positions,
        visible_widgets: visible
      });
      return true;
    } catch (error) {
      console.error("Failed to save widget preferences:", error);
      return false;
    }
  };
  
  // Save widget preferences with debounce
  const debouncedSavePreferences = (positions: GridItem[], visible: string[]) => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    
    const timer = setTimeout(() => {
      saveWidgetPreferences(positions, visible);
    }, 500); // 500ms debounce
    
    setSaveTimer(timer);
  };

  // Initialize grid items from visible widgets
  const initializeGridItems = (widgets: string[]) => {
    const items = widgets.map((widgetKey, index) => ({
      id: widgetKey,
      order: index,
    }));
    setGridItems(items);
  };

  // Effect to save preferences when they change
  useEffect(() => {
    if (gridItems.length > 0 && visibleWidgets.length > 0 && !loading) {
      debouncedSavePreferences(gridItems, visibleWidgets);
    }
    
    // Cleanup timer on unmount
    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [gridItems, visibleWidgets]);

  // Fetch ACL permissions and widget preferences on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get JWT token from local storage
        const token = localStorage.getItem("JWT_AUTH_TOKEN");
        if (!token) {
          console.warn("No JWT token found, using default widgets");
          initializeGridItems([
            ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
          ]);
          setLoading(false);
          return;
        }

        // Decode token to get user_id
        const decoded = jwtDecode(token) as DecodedToken;
        const userId = decoded.user_id;

        // Fetch widget preferences
        const preferences = await fetchWidgetPreferences();

        // Fetch ACL matrix from API (in parallel with preferences)
        const aclResponse = await axiosClient.get(
          `/acl/ui-matrix?user_id=${userId}`
        );
        const aclData: ACLResponse = aclResponse.data;

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

        // Now handle widget preferences if available
        if (preferences) {
          // Filter visible widgets based on authorization
          let filteredVisibleWidgets = preferences.visible_widgets.filter(
            (widget) => finalAuthorizedWidgets.includes(widget)
          );

          // Ensure mandatory widgets are included
          filteredVisibleWidgets = [
            ...new Set([...filteredVisibleWidgets, ...mandatoryWidgets]),
          ];

          setVisibleWidgets(filteredVisibleWidgets);

          // Filter grid items to ensure they only include authorized widgets
          const filteredPositions = preferences.positions.filter((item) =>
            finalAuthorizedWidgets.includes(item.id)
          );

          // Ensure all visible widgets have a position
          const missingWidgets = filteredVisibleWidgets.filter(
            (widgetKey) =>
              !filteredPositions.some((item) => item.id === widgetKey)
          );

          if (missingWidgets.length > 0) {
            // Add missing widgets to the end of the grid
            const nextOrder =
              filteredPositions.length > 0
                ? Math.max(...filteredPositions.map((item) => item.order)) + 1
                : 0;

            const newItems = [
              ...filteredPositions,
              ...missingWidgets.map((widgetKey, idx) => ({
                id: widgetKey,
                order: nextOrder + idx,
              })),
            ];

            setGridItems(newItems);
          } else {
            setGridItems(filteredPositions);
          }
        } else {
          // No saved preferences, use defaults filtered by authorization
          const defaultVisible = [
            ...new Set([
              ...defaultVisibleWidgets.filter((widget) =>
                finalAuthorizedWidgets.includes(widget)
              ),
              ...mandatoryWidgets,
            ]),
          ];

          setVisibleWidgets(defaultVisible);
          initializeGridItems(defaultVisible);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load widget data");

        // Use defaults as fallback
        const fallbackWidgets = [
          ...new Set([...defaultVisibleWidgets, ...mandatoryWidgets]),
        ];
        setVisibleWidgets(fallbackWidgets);
        initializeGridItems(fallbackWidgets);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      let newVisibleWidgets;
      if (isAdding) {
        // Add the widget to visible list
        newVisibleWidgets = [...prevWidgets, widgetKey];
        
        // Add the widget to the grid items with the next order number
        const newOrder = gridItems.length;
        setGridItems((prev) => [...prev, { id: widgetKey, order: newOrder }]);
      } else {
        // Remove from visible list
        newVisibleWidgets = prevWidgets.filter((w) => w !== widgetKey);
        
        // Remove the widget from grid items
        setGridItems((prev) => prev.filter((item) => item.id !== widgetKey));
        // Reorder remaining items
        setGridItems((prev) =>
          prev.map((item, index) => ({ ...item, order: index }))
        );
      }
      
      return newVisibleWidgets;
    });
  };

  // Update gridItems and save to API
  const updateGridItems = (items: GridItem[]) => {
    setGridItems(items);
    // API save happens in the effect above
  };

  return {
    visibleWidgets,
    setVisibleWidgets: (widgets: string[]) => {
      // Ensure mandatory widgets are always included when setting visible widgets programmatically
      const updatedWidgets = [...new Set([...widgets, ...mandatoryWidgets])];
      setVisibleWidgets(updatedWidgets);
    },
    authorizedWidgets,
    gridItems,
    setGridItems: updateGridItems,
    toggleWidget,
    loading,
    error,
    mandatoryWidgets,
    isStrictAuditor,
  };
};