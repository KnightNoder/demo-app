import React from "react";
import { render, screen } from "@testing-library/react";
import { DiagnosisItem } from "./DiagnosisItem";

describe("DiagnosisItem", () => {
  const mockItem = {
    title: "Hypertension",
    diagnosis: "I10",
    begdate: "2022-01-01",
    user: "Dr. John Doe",
  };

  it("renders the diagnosis title", () => {
    render(<DiagnosisItem item={mockItem} />);
    const titleElement = screen.getByText(/Hypertension/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the diagnosis code", () => {
    render(<DiagnosisItem item={mockItem} />);
    const diagnosisCodeElement = screen.getByText(/Diagnosis Code: I10/i);
    expect(diagnosisCodeElement).toBeInTheDocument();
  });

  it("renders the onset date", () => {
    render(<DiagnosisItem item={mockItem} />);
    const onsetDateElement = screen.getByText(/Onset: 2022-01-01/i);
    expect(onsetDateElement).toBeInTheDocument();
  });

  it("renders the user who updated", () => {
    render(<DiagnosisItem item={mockItem} />);
    const userElement = screen.getByText(/Updated by: Dr. John Doe/i);
    expect(userElement).toBeInTheDocument();
  });

});
