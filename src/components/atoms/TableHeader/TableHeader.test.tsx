import React from "react";
import { render, screen } from '@testing-library/react';
import TableHeader from './TableHeader';

describe('TableHeader Component', () => {
  it('should render the TableHeader with children', () => {
    render(<TableHeader>Test Header</TableHeader>);
    const header = screen.getByText(/Test Header/i);
    expect(header).toBeInTheDocument();
  });

  it('should render the TableHeader with default classes', () => {
    render(<TableHeader>Default Header</TableHeader>);
    const header = screen.getByText(/Default Header/i);
    expect(header).toHaveClass(
      'h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap'
    );
  });

  it('should render the TableHeader with custom className', () => {
    render(<TableHeader className="custom-class">Custom Class Header</TableHeader>);
    const header = screen.getByText(/Custom Class Header/i);
    expect(header).toHaveClass('custom-class');
  });

  it('should render the TableHeader with both default and custom classNames', () => {
    render(
      <TableHeader className="bg-gray-100">Header with Custom Class</TableHeader>
    );
    const header = screen.getByText(/Header with Custom Class/i);
    expect(header).toHaveClass('bg-gray-100');
    expect(header).toHaveClass(
      'h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap'
    );
  });
});
