import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from "../../src/components/atoms/Inputs/TextInput/Input";

// Test default render with no props
describe('Input Component', () => {
  it('should render with default variant', () => {
    render(<Input data-testid="input" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('border border-gray-300 rounded px-2 py-1');
  });

  it('should render with outlined variant', () => {
    render(<Input data-testid="input" variant="outlined" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('border-2 border-blue-500 rounded px-2 py-1');
  });

  it('should render with filled variant', () => {
    render(<Input data-testid="input" variant="filled" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('bg-gray-100 border border-gray-300 rounded px-2 py-1');
  });

  it('should apply additional className', () => {
    render(<Input data-testid="input" className="custom-class" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('custom-class');
  });

  it('should pass additional props to the input element', () => {
    render(<Input data-testid="input" placeholder="Enter text" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text');
  });

});
