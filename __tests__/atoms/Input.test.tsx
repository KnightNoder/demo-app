import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from "../../src/components/atoms/Inputs/TextInput/Input";

// Test default render with no props
describe('Input Component', () => {
  it("should render with default variant when no variant prop is provided", () => {
    render(<Input data-testid="input" />);
    const inputElement = screen.getByTestId("input");
    // The default variant is "default", so check for default styles
    expect(inputElement).toHaveClass(
      "border border-gray-300 rounded px-2 py-1"
    );
  });

  it("should render with outlined variant", () => {
    render(<Input data-testid="input" variant="outlined" />);
    const inputElement = screen.getByTestId("input");
    // Check for outlined specific styles
    expect(inputElement).toHaveClass(
      "border-2 border-blue-500 rounded px-2 py-1"
    );
  });

  it("should render with filled variant", () => {
    render(<Input data-testid="input" variant="filled" />);
    const inputElement = screen.getByTestId("input");
    // Check for filled specific styles
    expect(inputElement).toHaveClass(
      "bg-gray-100 border border-gray-300 rounded px-2 py-1"
    );
  });

  it("should apply additional className", () => {
    render(<Input data-testid="input" className="custom-class" />);
    const inputElement = screen.getByTestId("input");
    // Ensure the custom class is added
    expect(inputElement).toHaveClass("custom-class");
  });

  it("should pass additional props to the input element", () => {
    render(<Input data-testid="input" placeholder="Enter text" />);
    const inputElement = screen.getByTestId("input");
    // Ensure the placeholder prop is passed to the input element
    expect(inputElement).toHaveAttribute("placeholder", "Enter text");
  });

  // Test for invalid or unexpected variant
  it("should render default variant when given an invalid variant", () => {
    render(<Input data-testid="input" variant={"invalid" as any} />);
    const inputElement = screen.getByTestId("input");
    // The component should default to the "default" variant if an invalid variant is passed
    expect(inputElement).toHaveClass(
      "border border-gray-300 rounded px-2 py-1"
    );
  });

  // Test when no className is provided, ensuring it doesn't break the default styling
  it("should render with default styling when no className is provided", () => {
    render(<Input data-testid="input" variant="default" />);
    const inputElement = screen.getByTestId("input");
    // Default styling should be applied, even without a custom className
    expect(inputElement).toHaveClass(
      "border border-gray-300 rounded px-2 py-1"
    );
  });

  // Test when variant is explicitly set to "default" (should have no effect)
  it("should render default variant when explicitly given 'default' as variant", () => {
    render(<Input data-testid="input" variant="default" />);
    const inputElement = screen.getByTestId("input");
    // The variant is 'default', so it should render default styles
    expect(inputElement).toHaveClass(
      "border border-gray-300 rounded px-2 py-1"
    );
  });

  // Test when an empty string is passed as variant (should fall back to default)
  it("should render default variant when given an empty string as variant", () => {
    render(<Input data-testid="input" variant="" />);
    const inputElement = screen.getByTestId("input");
    // It should render default styles when an empty string is passed
    expect(inputElement).toHaveClass(
      "border border-gray-300 rounded px-2 py-1"
    );
  });
});
