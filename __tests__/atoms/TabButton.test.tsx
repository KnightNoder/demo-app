import React from "react";
import '@testing-library/jest-dom';
import { render, fireEvent } from "@testing-library/react";
import TabButton from "../../src/components/atoms/TabButton/TabButton"; // Adjust import path accordingly
// import Button from "../../src/components/atoms/Button/Button";  // Importing the Button atom

describe("TabButton", () => {
  const mockOnClick = jest.fn();

  // Test case 1: Render the button with the correct label
  it("should render with the correct label", () => {
    const { getByText } = render(
      <TabButton label="Tab 1" activeTab="Tab 1" onClick={mockOnClick} />
    );
    expect(getByText("Tab 1")).toBeInTheDocument();
  });

  // Test case 2: Check if the button has the correct class when active
  it("should have the active class when the tab is active", () => {
    const { container } = render(
      <TabButton label="Tab 1" activeTab="Tab 1" onClick={mockOnClick} />
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-white text-zinc-900 shadow-sm");
  });

  // Test case 3: Check if the button has the correct class when inactive
  it("should have the inactive class when the tab is not active", () => {
    const { container } = render(
      <TabButton label="Tab 2" activeTab="Tab 1" onClick={mockOnClick} />
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("text-zinc-500 hover:text-zinc-900");
  });

  // Test case 4: Ensure the onClick function is called with the correct label when clicked
  it("should call the onClick handler with the correct label when clicked", () => {
    const { getByText } = render(
      <TabButton label="Tab 1" activeTab="Tab 1" onClick={mockOnClick} />
    );
    fireEvent.click(getByText("Tab 1"));
    expect(mockOnClick).toHaveBeenCalledWith("Tab 1");
  });

  // Test case 5: Ensure the count is displayed when provided
  it("should display the count when provided", () => {
    const { getByText } = render(
      <TabButton label="Tab 1" activeTab="Tab 1" onClick={mockOnClick} count={5} />
    );
    expect(getByText("5")).toBeInTheDocument();
  });

  // Test case 6: Ensure the count is not displayed when not provided
  it("should not display the count when not provided", () => {
    const { queryByText } = render(
      <TabButton label="Tab 1" activeTab="Tab 1" onClick={mockOnClick} />
    );
    expect(queryByText("5")).toBeNull();
  });
});
