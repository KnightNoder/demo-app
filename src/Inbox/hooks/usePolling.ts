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
  const [isPollingState, setIsPolling] = useState(isPolling);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isPollingState) {
        fetchDataFunction();
      }
    }, pollingInterval);
  }, [fetchDataFunction, pollingInterval, isPollingState]);

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
  const handleManualRefresh = () => {
    fetchDataFunction();
  };

  // Setup polling when isPolling changes
  useEffect(() => {
    if (isPollingState) {
      startPolling();
    } else {
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
    togglePolling,
    handleManualRefresh,
    setPollingStatus,
    setPollingError,
    setLastUpdated,
    setIsPolling,
  };
};