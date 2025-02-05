import React from "react";
import '@testing-library/jest-dom';
import { render, fireEvent } from "@testing-library/react";
import TabListHeader from "../../src/components/molecules/TabListHeader/TabListHeader";  // Adjust import path accordingly



// Mock TabButton component to avoid rendering the actual Button atom
jest.mock("../../src/components/atoms/TabButton/TabButton", () => ({
  __esModule: true,
  default: jest.fn(({ label, activeTab, onClick, count }) => <button
    onClick={() => onClick(label)}
    className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-sm w-full ${activeTab === label
      ? "bg-white text-zinc-900 shadow-sm"
      : "text-zinc-500 hover:text-zinc-900"
      }`}
  >
    {label}
    {count !== undefined && (
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ml-2 h-4 w-4">
        {count}
      </div>
    )}
  </button>),
}));

describe("TabListHeader", () => {
  const mockOnTabClick = jest.fn();

  const tabs = [
    { label: "Tab 1", count: 5 },
    { label: "Tab 2" },
    { label: "Tab 3", count: 3 },
  ];

  // Test case 1: Renders the correct number of TabButton components
  it("should render the correct number of TabButton components", () => {
    const { getAllByRole } = render(
      <TabListHeader tabs={tabs} activeTab="Tab 1" onTabClick={mockOnTabClick} />
    );
    const buttons = getAllByRole("button");
    expect(buttons).toHaveLength(tabs.length);
  });

  // Test case 2: Sets the correct active tab
  it("should pass the activeTab prop correctly to TabButton", () => {
    const { getByText } = render(
      <TabListHeader tabs={tabs} activeTab="Tab 1" onTabClick={mockOnTabClick} />
    );
    // The active tab should have the 'bg-white text-zinc-900 shadow-sm' class
    const activeTabButton = getByText("Tab 1");
    expect(activeTabButton).toHaveClass("bg-white text-zinc-900 shadow-sm");
  });

  // Test case 3: Calls onTabClick when a tab is clicked
  it("should call onTabClick with the correct label when a tab is clicked", () => {
    const { getByText } = render(
      <TabListHeader tabs={tabs} activeTab="Tab 1" onTabClick={mockOnTabClick} />
    );
    const tabButton = getByText("Tab 2"); // Select Tab 2
    fireEvent.click(tabButton);
    expect(mockOnTabClick).toHaveBeenCalledWith("Tab 2");
  });

  // Test case 4: Renders the count for each tab if provided
  it("should render the count for each tab if provided", () => {
    const { getByText } = render(
      <TabListHeader tabs={tabs} activeTab="Tab 1" onTabClick={mockOnTabClick} />
    );
    expect(getByText("5")).toBeInTheDocument(); // Tab 1 has count 5
    expect(getByText("3")).toBeInTheDocument(); // Tab 3 has count 3
  });

});
