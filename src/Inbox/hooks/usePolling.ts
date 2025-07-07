import { useState, useCallback, useRef, useEffect } from "react";

// Polling status type
export type PollingStatus = "active" | "paused" | "error" | "idle";

interface UsePollingProps {
  pollingInterval: number;
  isPolling: boolean;
  fetchDataFunction: () => Promise<void>;
}

interface UsePollingReturn {
  pollingStatus: PollingStatus;
  lastUpdated: Date | null;
  pollingError: string | null;
  isRefreshing: boolean; // New state for manual refresh loading
  togglePolling: () => void;
  handleManualRefresh: () => void;
  setPollingStatus: (status: PollingStatus) => void;
  setPollingError: (error: string | null) => void;
  setLastUpdated: (date: Date | null) => void;
  setIsPolling: (isPolling: boolean | ((prev: boolean) => boolean)) => void;
}

export const usePolling = ({ 
  pollingInterval, 
  isPolling, 
  fetchDataFunction 
}: UsePollingProps): UsePollingReturn => {
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // Initialize new state
  const [isPollingState, setIsPolling] = useState(isPolling);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state with prop
  useEffect(() => {
    setIsPolling(isPolling);
  }, [isPolling]);

  // Start polling
  const startPolling = useCallback(() => {
    console.log("Starting polling with interval:", pollingInterval);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      console.log("Polling interval triggered, calling fetchDataFunction");
      fetchDataFunction();
    }, pollingInterval);
  }, [fetchDataFunction, pollingInterval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Toggle polling
  const togglePolling = () => {
    setIsPolling((prev) => {
      const newPollingState = !prev;
      if (newPollingState) {
        setPollingStatus("active");
        // Immediately fetch data when resuming
        fetchDataFunction();
      } else {
        setPollingStatus("paused");
      }
      return newPollingState;
    });
  };

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true); // Set loading state
    try {
      await fetchDataFunction();
    } finally {
      setIsRefreshing(false); // Reset loading state
    }
  };

  // Setup polling when isPolling changes
  useEffect(() => {
    console.log("usePolling effect: isPollingState =", isPollingState);
    if (isPollingState) {
      console.log("Starting polling...");
      startPolling();
    } else {
      console.log("Stopping polling...");
      stopPolling();
    }

    return () => stopPolling();
  }, [isPollingState, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    pollingStatus,
    lastUpdated,
    pollingError,
    isRefreshing, // Expose new state
    togglePolling,
    handleManualRefresh,
    setPollingStatus,
    setPollingError,
    setLastUpdated,
    setIsPolling,
  };
};