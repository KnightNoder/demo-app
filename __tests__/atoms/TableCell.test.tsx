import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableCell from "../../src/components/atoms/TableCell/TableCell";

describe('TableCell Component', () => {
  it('should render the TableCell with children', () => {
    render(<TableCell>Test Cell</TableCell>);
    const cell = screen.getByText(/Test Cell/i);
    expect(cell).toBeInTheDocument();
  });

  it('should render the TableCell with default classes', () => {
    render(<TableCell>Default Cell</TableCell>);
    const cell = screen.getByText(/Default Cell/i).closest("td"); // Ensure we check the actual <td> element
    expect(cell).toHaveClass(
      "py-2 px-2 my-10 text-[12px] align-middle text-left"
    ); // Fixed text-left instead of text-center
  });

  it("should render the TableCell with additional className", () => {
    render(<TableCell className="custom-class">Custom Class Cell</TableCell>);
    const cell = screen.getByText(/Custom Class Cell/i).closest("td");
    expect(cell).toHaveClass("custom-class");
  });

  it("should render the TableCell with both default and custom classNames", () => {
    render(
      <TableCell className="bg-gray-100">Cell with Custom Class</TableCell>
    );
    const cell = screen.getByText(/Cell with Custom Class/i).closest("td");
    expect(cell).toHaveClass("bg-gray-100");
    expect(cell).toHaveClass(
      "py-2 px-2 my-10 text-[12px] align-middle text-left"
    ); // Fixed text-left
  });
});
