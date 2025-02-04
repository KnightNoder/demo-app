import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pill from "../../src/components/atoms/Pill/Pill";

describe('Pill Component', () => {
  it('should render the pill with text', () => {
    render(<Pill text="Test Pill" />);
    const pillElement = screen.getByText(/Test Pill/i); // Using text query
    expect(pillElement).toBeInTheDocument();
    expect(pillElement).toHaveClass('inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-[10px]');
  });

  it('should render with additional className', () => {
    render(<Pill text="Custom Pill" className="custom-class" />);
    const pillElement = screen.getByText(/Custom Pill/i);
    expect(pillElement).toHaveClass('custom-class');
  });

  it('should render the pill with default classes when no className is passed', () => {
    render(<Pill text="Default Pill" />);
    const pillElement = screen.getByText(/Default Pill/i);
    expect(pillElement).toHaveClass('inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-[10px]');
  });

  it('should render different text correctly', () => {
    render(<Pill text="Another Pill" />);
    const pillElement = screen.getByText(/Another Pill/i);
    expect(pillElement).toBeInTheDocument();
  });
});
