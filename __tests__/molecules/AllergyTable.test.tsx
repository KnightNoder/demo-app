import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import AllergyTable from "../../src/components/molecules/AllergyTable/AllergyTable";
import AllergyRow from "../../src/components/molecules/AllergyRow/AllergyRow";

jest.mock("../../src/components/molecules/AllergyRow/AllergyRow", () => {
  return jest.fn(() => <tr data-testid="allergy-row" />);
});

describe("AllergyTable Component", () => {
  const allergies = [
    {
      id: "1",
      allergen: "Peanuts",
      type: "Food",
      severity: "High",
      reaction: "Anaphylaxis",
      begdate: "2020-01-01",
      enddate: "2020-12-31",
    },
    {
      id: "2",
      allergen: "Dust",
      type: "Environmental",
      severity: "Medium",
      reaction: "Sneezing",
      begdate: "2021-06-01",
    },
  ];

  it("renders table with headers correctly", () => {
    render(<AllergyTable allergies={allergies} />);
    // Check if all table headers are rendered correctly
    expect(screen.getByText("Allergen")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Severity")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Reactions")).toBeInTheDocument();
    expect(screen.getByText("Onset Date")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();
  });

  it("renders no rows if allergies array is empty", () => {
    render(<AllergyTable allergies={[]} />);
    // Check if no rows are rendered
    const rows = screen.queryAllByTestId("allergy-row");
    expect(rows.length).toBe(0);
  });

  it("passes the correct props to AllergyRow component", () => {
    render(<AllergyTable allergies={allergies} />);
    // Check if the first AllergyRow received the correct allergy data
    expect(AllergyRow).toHaveBeenCalledWith(
      expect.objectContaining({
        allergy: allergies[0],
      }),
      expect.any(Object) // ignore other props (like ref)
    );
  });

});
