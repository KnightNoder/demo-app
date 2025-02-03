// import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  it("renders the button with default props", () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument(); // This should now work
    expect(button).toHaveClass("bg-gray-400"); // Default variant class
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("rounded");
  });

  it("applies the correct classes for the 'primary' variant", () => {
    render(<Button variant="primary">Primary Button</Button>);

    const button = screen.getByRole("button", { name: /primary button/i });
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("hover:bg-blue-600");
  });

  it("applies the correct classes for the 'secondary' variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole("button", { name: /secondary button/i });
    expect(button).toHaveClass("bg-gray-500");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("hover:bg-gray-600");
  });

  it("applies the correct classes for the 'danger' variant", () => {
    render(<Button variant="danger">Danger Button</Button>);

    const button = screen.getByRole("button", { name: /danger button/i });
    expect(button).toHaveClass("bg-red-500");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("hover:bg-red-600");
  });

  it("applies custom class names correctly", () => {
    render(<Button className="custom-class">Custom Class Button</Button>);

    const button = screen.getByRole("button", { name: /custom class button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("handles onClick events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("passes additional HTML attributes to the button", () => {
    render(<Button aria-label="Test Button">Test</Button>);

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeInTheDocument();
  });
});
