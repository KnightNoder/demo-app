/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import AllergiesCard from "../../../src/components/organisms/AllergiesCard/AllergiesCard"; // Adjust the import path accordingly

describe("AllergiesCard Component", () => {
  // Test that the component renders without crashing
  it("should render without errors", () => {
    mount(<AllergiesCard />);

    // Check if the skeleton loader is visible (assuming loading state is triggered initially)
    cy.get('.react-loading-skeleton').should('exist');
  });

  // Test that the error message renders if an error is triggered
  it("should display error message when there is an error", () => {
    const errorMessage = "Failed to load allergies";
    mount(<AllergiesCard />);

    // Assuming error state is handled within the component
    cy.contains("Oops! Something went wrong.").should('exist');
    cy.contains(errorMessage).should('exist');
  });

  // Test that the AllergyTable is rendered when allergies data is available
  it("should display AllergyTable when allergies data is loaded", () => {
    // Mock allergies state for successful loading
    const mockAllergies = [
      { id: "1", title: "Peanuts", allergen: "Peanut", severity: { id: "1", title: "High" }, reaction: "Hives", begdate: "2021-01-01", enddate: null, modified_by: { fname: "John", lname: "Doe" } },
    ];

    cy.window().then((win) => {
      win.store = {
        getState: () => ({
          allergies: { allergies: mockAllergies, loading: false, error: null },
        }),
        dispatch: () => { },
      };
    });

    mount(<AllergiesCard />);

    // Ensure the AllergyTable is rendered and contains mock data
    cy.get("table").should("exist");
    cy.get("td").contains("Peanuts").should("exist");
  });
});
