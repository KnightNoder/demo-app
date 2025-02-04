import React from "react";
import { render, screen } from "@testing-library/react";
import AllergyRow from "../../src/components/molecules/AllergyRow/AllergyRow"; // Adjust the import path as needed
import '@testing-library/jest-dom'; // Ensure jest-dom is imported for custom matchers

describe("AllergyRow Component", () => {
  const mockAllergy = {
    id: "1",
    allergen: "Peanuts",
    type: "Food",
    severity: "High",
    reaction: "Anaphylaxis",
    begdate: "2022-01-01",
    enddate: "2023-01-01",
  };

  const mockAllergyNoReaction = {
    ...mockAllergy,
    reaction: undefined,
  };

  const mockAllergyNoEndDate = {
    ...mockAllergy,
    enddate: undefined,
  };

  it("should render without crashing", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    // Check if table row is rendered
    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();
  });

  it("should display allergen in the first cell", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const allergenCell = screen.getByText("Peanuts");
    expect(allergenCell).toBeInTheDocument();
  });

  it("should display the type as a pill", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const typePill = screen.getByText("Food");
    expect(typePill).toBeInTheDocument();
    expect(typePill).toHaveClass("text-gray-500");
  });

  it("should display the severity as a pill", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const severityPill = screen.getByText("High");
    expect(severityPill).toBeInTheDocument();
    expect(severityPill).toHaveClass("text-gray-700");
  });

  it("should display the reaction as a pill or 'N/A' if no reaction", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const reactionPill = screen.getByText("Anaphylaxis");
    expect(reactionPill).toBeInTheDocument();
    expect(reactionPill).toHaveClass("text-gray-600");

    render(<AllergyRow allergy={mockAllergyNoReaction} />);
    const noReactionText = screen.getByText("N/A");
    expect(noReactionText).toBeInTheDocument();
  });

  it("should display the begdate correctly", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const begdateCell = screen.getByText("2022-01-01");
    expect(begdateCell).toBeInTheDocument();
  });

  it("should display the enddate correctly or 'N/A' if not provided", () => {
    render(<AllergyRow allergy={mockAllergy} />);
    const enddateCell = screen.getByText("2023-01-01");
    expect(enddateCell).toBeInTheDocument();

    render(<AllergyRow allergy={mockAllergyNoEndDate} />);
    const noEnddateText = screen.getByText("N/A");
    expect(noEnddateText).toBeInTheDocument();
  });

  it("should have correct hover effect", () => {
    const { container } = render(<AllergyRow allergy={mockAllergy} />);
    const row = container.querySelector("tr");
    expect(row).toHaveClass("transition-colors");
    row?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(row).toHaveClass("hover:bg-muted/50");
  });
});
