import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pill from "../../src/components/atoms/Pill/Pill";

describe('Pill Component', () => {
  it('should render the pill with text', () => {
    render(<Pill text="Test Pill" />);
    const pillElement = screen.getByText(/Test Pill/i);
    expect(pillElement).toBeInTheDocument();
    // Fixed the class name to match the component's actual class name
    expect(pillElement).toHaveClass(
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-[12px] transition-colors duration-200 hover:bg-gray-200"
    );
  });

  it('should render with additional className', () => {
    render(<Pill text="Custom Pill" className="custom-class" />);
    const pillElement = screen.getByText(/Custom Pill/i);
    // Check if the custom class is added correctly
    expect(pillElement).toHaveClass("custom-class");
  });

  it('should render the pill with default classes when no className is passed', () => {
    render(<Pill text="Default Pill" />);
    const pillElement = screen.getByText(/Default Pill/i);
    // Fixed the class name to match the component's actual class name
    expect(pillElement).toHaveClass(
      "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-[12px] transition-colors duration-200 hover:bg-gray-200"
    );
  });

  it('should render different text correctly', () => {
    render(<Pill text="Another Pill" />);
    const pillElement = screen.getByText(/Another Pill/i);
    expect(pillElement).toBeInTheDocument();
  });
});
