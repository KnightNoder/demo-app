/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import AllergyTable from "../../src/components/molecules/AllergyTable/AllergyTable"; // Adjust the import path accordingly

// Mock data for allergies
const mockAllergies = [
  {
    id: "1",
    title: "Peanut",
    allergen: "Peanut",
    severity: {
      id: "1",
      title: "Severe",
    },
    reaction: "Anaphylaxis",
    begdate: "2022-01-01",
    enddate: null,
    modified_by: {
      fname: "John",
      lname: "Doe",
    },
  },
  {
    id: "2",
    title: "Shellfish",
    allergen: "Shellfish",
    severity: {
      id: "2",
      title: "Moderate",
    },
    reaction: "Hives",
    begdate: "2021-05-01",
    enddate: "2022-01-01",
    modified_by: {
      fname: "Jane",
      lname: "Smith",
    },
  },
];

// Test for rendering the component when no allergies are present
describe("AllergyTable", () => {
  it("renders 'No allergies found.' when there are no allergies", () => {
    mount(<AllergyTable allergies={[]} loading={false} />);
    cy.contains("No allergies found.");
  });

  // Test for rendering loading state (Skeletons)
  it("renders loading skeletons when loading is true", () => {
    mount(<AllergyTable allergies={[]} loading={true} />);
    cy.get("td").find(".skeleton").should("have.length", 7); // Checking that there are 7 skeletons rendered
  });

  // Test for rendering the table when allergies are provided
  it("renders the table with allergies when loading is false", () => {
    mount(<AllergyTable allergies={mockAllergies} loading={false} />);

    // Verify that each allergy is shown correctly in the table
    cy.contains("Peanut");
    cy.contains("Shellfish");

    // Verify that the table has the correct number of rows
    cy.get("tbody").children().should("have.length", 2);  // Ensure two rows are rendered

    // Test if the headers are rendered correctly
    cy.get("th").eq(0).should("have.text", "Allergen");
    cy.get("th").eq(1).should("have.text", "Type");
    cy.get("th").eq(2).should("have.text", "Severity");
    cy.get("th").eq(3).should("have.text", "Status");
    cy.get("th").eq(4).should("have.text", "Reactions");
    cy.get("th").eq(5).should("have.text", "Onset Date");
    cy.get("th").eq(6).should("have.text", "Last Updated");
  });

  // Test for invalid allergies data type (non-array)
  it("renders error message when allergies data is not an array", () => {
    mount(<AllergyTable allergies={null as any} loading={false} />);
    cy.contains("Error: Expected an array of allergies.");
  });
});

