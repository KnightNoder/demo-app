import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Checkbox from "../../src/components/atoms/Checkbox/Checkbox";

describe("Checkbox Component", () => {
  it("handles the checked prop correctly", async () => {
    // Test case for checked state true
    const { unmount } = render(<Checkbox checked={true} onChange={() => { }} />);
    const checkedBox = screen.getByTestId("checkbox");
    await waitFor(() => expect(checkedBox).toBeChecked());

    // Unmount the first instance
    unmount();

    // Test case for checked state false
    render(<Checkbox checked={false} onChange={() => { }} />);
    const uncheckedBox = screen.getByTestId("checkbox");
    await waitFor(() => expect(uncheckedBox).not.toBeChecked());
  });

  it("triggers the onChange handler when clicked", () => {
    const handleChange = jest.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);

    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("applies the correct variant classes", () => {
    const { rerender } = render(
      <Checkbox checked={false} variant="primary" onChange={() => { }} />
    );
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveClass("bg-blue-500");

    rerender(<Checkbox checked={false} variant="secondary" onChange={() => { }} />);
    expect(checkbox).toHaveClass("bg-gray-500");

    rerender(<Checkbox checked={false} variant="default" onChange={() => { }} />);
    expect(checkbox).toHaveClass("bg-white");
  });
});