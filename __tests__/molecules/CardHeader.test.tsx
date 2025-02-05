import React from "react";
import { render, screen } from "@testing-library/react";
import CardHeader from "../../src/components/molecules/CardHeader/CardHeader"; // Adjust import path accordingly
import "@testing-library/jest-dom";

export type MenuIconVariant = "download" | "print" | "share" | "delete";

export interface MenuOption {
  label: string;
  icon: MenuIconVariant;
  onClick: () => void;
  disabled: boolean;
}

// Mocking the Icon and Button components, assuming these are imported from elsewhere
jest.mock("../../src/components/atoms/Button/Button", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("../../src/assets/Icons/Icons", () => ({
  __esModule: true,
  default: ({ variant }: { variant: string }) => <span>{variant}</span>,
}));

describe("CardHeader", () => {
  const mockOnCollapse = jest.fn();
  const mockOnExpand = jest.fn();
  const mockOnKebabMenuToggle = jest.fn();


  beforeEach(() => {
    mockOnCollapse.mockClear();
    mockOnExpand.mockClear();
    mockOnKebabMenuToggle.mockClear();
  });

  test("renders CardHeader component with title", () => {
    render(
      <CardHeader
        title="Test Title"
        isCollapsed={false}
        onCollapse={mockOnCollapse}
        onExpand={mockOnExpand}
        onKebabMenuToggle={mockOnKebabMenuToggle}
        isKebabMenuOpen={false}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  // test("calls onCollapse when collapse button is clicked", () => {
  //   render(
  //     <CardHeader
  //       title="Test Title"
  //       isCollapsed={false}
  //       onCollapse={mockOnCollapse}
  //       onExpand={mockOnExpand}
  //       onKebabMenuToggle={mockOnKebabMenuToggle}
  //       isKebabMenuOpen={false}
  //     />
  //   );

  //   const collapseButton = screen.getByText("collapseDown");
  //   fireEvent.click(collapseButton);

  //   expect(mockOnCollapse).toHaveBeenCalledTimes(1);
  // });

  // test("calls onExpand when expand button is clicked", () => {
  //   render(
  //     <CardHeader
  //       title="Test Title"
  //       isCollapsed={false}
  //       onCollapse={mockOnCollapse}
  //       onExpand={mockOnExpand}
  //       onKebabMenuToggle={mockOnKebabMenuToggle}
  //       isKebabMenuOpen={false}
  //     />
  //   );

  //   const expandButton = screen.getByText("modalExpand");
  //   fireEvent.click(expandButton);

  //   expect(mockOnExpand).toHaveBeenCalledTimes(1);
  // });

  // test("calls onKebabMenuToggle when kebab menu button is clicked", () => {
  //   render(
  //     <CardHeader
  //       title="Test Title"
  //       isCollapsed={false}
  //       onCollapse={mockOnCollapse}
  //       onExpand={mockOnExpand}
  //       onKebabMenuToggle={mockOnKebabMenuToggle}
  //       isKebabMenuOpen={false}
  //     />
  //   );

  //   const kebabMenuButton = screen.getByText("kebab-menu");
  //   fireEvent.click(kebabMenuButton);

  //   expect(mockOnKebabMenuToggle).toHaveBeenCalledTimes(1);
  // });

  // test("disables the 'Cannot Delete Default Widget' option", () => {
  //   render(
  //     <CardHeader
  //       title="Test Title"
  //       isCollapsed={false}
  //       onCollapse={mockOnCollapse}
  //       onExpand={mockOnExpand}
  //       onKebabMenuToggle={mockOnKebabMenuToggle}
  //       isKebabMenuOpen={true}
  //     />
  //   );

  //   const disabledOption = screen.getByText("Cannot Delete Default Widget");
  //   expect(disabledOption).toBeDisabled();
  // });

  test("renders correct number of menu options", () => {
    render(
      <CardHeader
        title="Test Title"
        isCollapsed={false}
        onCollapse={mockOnCollapse}
        onExpand={mockOnExpand}
        onKebabMenuToggle={mockOnKebabMenuToggle}
        isKebabMenuOpen={true}
      />
    );

    // Check the number of buttons for each menu option
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(7); // 4 menu options + 1 for the kebab menu toggle
  });


});
