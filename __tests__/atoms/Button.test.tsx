import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Button from "../../src/components/atoms/Button/Button";  // Adjust the import path based on your folder structure

// Mock Icon component
jest.mock("../../src/assets/Icons/Icons", () => {
  return jest.fn(() => <svg data-testid="icon" />);
});

describe("Button Component", () => {
  it("renders button with primary variant", () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Primary Button");
    expect(button).toHaveClass("text-[#0093D3]"); // check for primary variant class
  });

  it("renders button with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Secondary Button");
    expect(button).toHaveClass("text-[#0093D3]"); // check for secondary variant class
  });

  it("renders button with default variant", () => {
    render(<Button variant="default">Default Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Default Button");
    expect(button).toHaveClass("bg-transparent"); // check for default variant class
  });

  it("renders button with an icon", () => {
    render(<Button variant="primary" icon="add">Button with Icon</Button>);
    const button = screen.getByRole("button");
    const icon = screen.getByTestId("icon");
    expect(button).toHaveTextContent("Button with Icon");
    expect(icon).toBeInTheDocument();  // Check if the icon is rendered
  });

  it("renders button without an icon", () => {
    render(<Button variant="primary">Button without Icon</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Button without Icon");
    const icon = screen.queryByTestId("icon");
    expect(icon).not.toBeInTheDocument();  // Check if the icon is not rendered
  });

  it("calls onClick function when button is clicked", () => {
    const onClick = jest.fn();
    render(<Button variant="primary" onClick={onClick}>Clickable Button</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);  // Check if the onClick handler was called
  });

  it("applies correct classes for default variant", () => {
    render(<Button variant="default">Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent");
  });
});
