// Generic function to get button position
export const getButtonPosition = (
  buttonElementOrEvent?: HTMLElement | React.MouseEvent | Event
) => {
  if (buttonElementOrEvent) {
    let element: HTMLElement | null = null;

    if (
      buttonElementOrEvent instanceof Event ||
      "currentTarget" in buttonElementOrEvent
    ) {
      element = (buttonElementOrEvent as any).currentTarget as HTMLElement;
    } else if (
      buttonElementOrEvent &&
      "getBoundingClientRect" in buttonElementOrEvent
    ) {
      element = buttonElementOrEvent as HTMLElement;
    }

    if (element && typeof element.getBoundingClientRect === "function") {
      try {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        };
      } catch (error) {
        console.warn("Could not get button position:", error);
      }
    }
  }

  return { top: 60, right: 20 };
};

// Format time for display
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Get interval display text
export const getIntervalText = (interval: number): string => {
  switch (interval) {
    case 30000:
      return "30s";
    case 60000:
      return "1m";
    default:
      return "30s";
  }
};

// Get status display info
export const getStatusInfo = (pollingStatus: "active" | "paused" | "error" | "idle") => {
  switch (pollingStatus) {
    case "active":
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: "🔄",
        text: "Auto-refreshing",
      };
    case "paused":
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: "⏸️",
        text: "Paused",
      };
    case "error":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "❌",
        text: "Error",
      };
    default:
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: "⏹️",
        text: "Idle",
      };
  }
};