import axiosClient from "../api/axiosClient";
import { GridItem } from "../types";

// Interface for widget preferences data
export interface WidgetPreferencesData {
  positions: GridItem[];
  visible_widgets: string[];
}

/**
 * Service for handling widget preferences API calls
 */
export const widgetPreferencesApi = {
  /**
   * Fetch widget preferences for a user
   * @param userId The user ID
   * @returns Promise with widget preferences data
   */
  fetchPreferences: async (userId: string): Promise<WidgetPreferencesData | null> => {
    try {
      const response = await axiosClient.get(`/widget-preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch widget preferences:", error);
      return null;
    }
  },

  /**
   * Save widget preferences for a user
   * @param userId The user ID
   * @param data Widget preferences data (positions and visible widgets)
   * @returns Promise indicating success/failure
   */
  savePreferences: async (
    userId: string,
    data: WidgetPreferencesData
  ): Promise<boolean> => {
    try {
      await axiosClient.post(`/widget-preferences/${userId}`, data);
      return true;
    } catch (error) {
      console.error("Failed to save widget preferences:", error);
      return false;
    }
  },

  /**
   * Update widget positions only
   * @param userId The user ID
   * @param positions Updated grid item positions
   * @returns Promise indicating success/failure
   */
  updatePositions: async (
    userId: string,
    positions: GridItem[]
  ): Promise<boolean> => {
    try {
      await axiosClient.patch(`/widget-preferences/${userId}/positions`, {
        positions
      });
      return true;
    } catch (error) {
      console.error("Failed to update widget positions:", error);
      return false;
    }
  },

  /**
   * Update visible widgets only
   * @param userId The user ID
   * @param visibleWidgets List of visible widget keys
   * @returns Promise indicating success/failure
   */
  updateVisibleWidgets: async (
    userId: string,
    visibleWidgets: string[]
  ): Promise<boolean> => {
    try {
      await axiosClient.patch(`/widget-preferences/${userId}/visible`, {
        visible_widgets: visibleWidgets
      });
      return true;
    } catch (error) {
      console.error("Failed to update visible widgets:", error);
      return false;
    }
  }
};

export default widgetPreferencesApi;