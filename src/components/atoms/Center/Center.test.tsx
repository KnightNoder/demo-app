// Center.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Center from "./Center";

// Test if the component renders without crashing
describe("Center Component", () => {
  it("should render children correctly", () => {
    render(
      <Center>
        <div data-testid="child">Hello, World!</div>
      </Center>
    );
    // Check if the child content is rendered
    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Hello, World!");
  });

  it("should have correct CSS classes applied", () => {
    render(
      <Center>
        <div>Child Element</div>
      </Center>
    );

    const divElement = screen.getByText("Child Element").parentElement;

    // Check if the div has the correct CSS classes
    expect(divElement).toHaveClass("flex");
    expect(divElement).toHaveClass("justify-center");
    expect(divElement).toHaveClass("items-center");
    expect(divElement).toHaveClass("h-[100vh]");
  });
});
