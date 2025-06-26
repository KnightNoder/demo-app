import { FilterState } from "../components/organisms/FilterPopup";
import { SortOption } from "../components/organisms/SortPopup";

// Task card configuration interface
export interface TaskCardConfig {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  variant: "urgent" | "normal";
  priority: "high" | "medium" | "low" | "other";
  testId: string;
}

// Sorting function for cards
export const sortCards = (cards: TaskCardConfig[], currentSort: SortOption): TaskCardConfig[] => {
  const sortedCards = [...cards];

  switch (currentSort) {
    case "priority-high-to-low":
      return sortedCards.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1, other: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    case "priority-low-to-high":
      return sortedCards.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1, other: 0 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    case "count-high-to-low":
      return sortedCards.sort((a, b) => b.count - a.count);

    case "count-low-to-high":
      return sortedCards.sort((a, b) => a.count - b.count);

    case "label-a-to-z":
      return sortedCards.sort((a, b) => a.title.localeCompare(b.title));

    case "label-z-to-a":
      return sortedCards.sort((a, b) => b.title.localeCompare(a.title));

    default:
      return sortedCards;
  }
};

// Filter cards based on selected filters
export const filterCards = (cards: TaskCardConfig[], filters: FilterState): TaskCardConfig[] => {
  let filteredCards = [...cards];

  if (filters.low || filters.medium || filters.high) {
    filteredCards = filteredCards.filter((card) => {
      const count = card.count;
      if (filters.low && count >= 0 && count <= 5) return true;
      if (filters.medium && count >= 6 && count <= 10) return true;
      if (filters.high && count >= 11) return true;
      return false;
    });
  }

  if (filters.customOnly) {
    filteredCards = filteredCards.filter((card) => card.id.includes("custom"));
  }

  if (filters.defaultOnly) {
    filteredCards = filteredCards.filter((card) => !card.id.includes("custom"));
  }

  return filteredCards;
};

// Get cards by priority with updated counts
export const getCardsByPriority = (
  priority: string,
  taskCards: TaskCardConfig[],
  birthdayCount: number,
  agendaCount: number,
  urgentTaskCounts: { high: number; medium: number; low: number }
): TaskCardConfig[] => {
  return taskCards
    .filter((card) => card.priority === priority)
    .map((card) => {
      if (card.id === "birthdays") {
        return { ...card, count: birthdayCount };
      }

      if (card.id === "agenda" || card.id === "upcoming-appointments") {
        return { ...card, count: agendaCount };
      }

      if (card.title === "Urgent Tasks") {
        let count = 0;
        switch (priority) {
          case "high":
            count = urgentTaskCounts.high;
            break;
          case "medium":
            count = urgentTaskCounts.medium;
            break;
          case "low":
            count = urgentTaskCounts.low;
            break;
          default:
            count = card.count;
        }
        return { ...card, count };
      }

      return card;
    });
};