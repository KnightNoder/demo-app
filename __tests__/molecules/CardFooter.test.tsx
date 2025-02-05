import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import CardFooter from "../../src/components/molecules/CardFooter/CardFooter";

// Mocking Icons component
jest.mock("../../src/assets/Icons/Icons", () => ({
  __esModule: true,
  default: ({ variant }: { variant: string }) => <span>{variant} Icon</span>,
}));

describe("CardFooter", () => {
  it("should render the 'Add Allergy' button with the correct icon and text", () => {
    render(<CardFooter />);

    const addButton = screen.getByRole("button", { name: /add allergy/i });
    expect(addButton).toBeInTheDocument();


    // Checking if the button text is correct
    const buttonText = screen.getByText(/add allergy/i);
    expect(buttonText).toBeInTheDocument();
  });

  it("should render the 'View History' button with the correct text", () => {
    render(<CardFooter />);

    const viewHistoryButton = screen.getByRole("button", { name: /view history/i });
    expect(viewHistoryButton).toBeInTheDocument();
  });


  it("should render both buttons inside the CardFooter", () => {
    render(<CardFooter />);

    const primaryButton = screen.getByRole("button", { name: /add allergy/i });
    const secondaryButton = screen.getByRole("button", { name: /view history/i });

    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();
  });

  it("should have a footer with the correct styling classes", () => {
    render(<CardFooter />);

    const footer = screen.getByRole("contentinfo"); // You can use `contentinfo` for the footer role if you want
    expect(footer).toHaveClass("footer");
    expect(footer).toHaveClass("absolute");
    expect(footer).toHaveClass("bottom-0");
    expect(footer).toHaveClass("left-0");
    expect(footer).toHaveClass("right-0");
    expect(footer).toHaveClass("h-14");
    expect(footer).toHaveClass("bg-white/95");
  });
});
