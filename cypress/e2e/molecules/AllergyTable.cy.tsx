// import React from "react";
// import { mount } from "cypress/react";

describe("AllergyTable Component", () => {
  const allergies = [
    {
      id: "1",
      allergen: "Peanuts",
      type: "allergy",
      severity: "255604002",
      reaction: "Anaphylaxis",
      begdate: "2025-01-01 17:49:01",
      enddate: "2020-12-31",
    },
    {
      id: "2",
      allergen: "Pencillin",
      type: "allergy",
      severity: "255604002",
      reaction: "Sneezing",
      begdate: "2025-01-01 17:49:01",
    },
    {
      id: "1",
      allergen: "Peanuts",
      type: "allergy",
      severity: "255604002",
      reaction: "Anaphylaxis",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
    },
    {
      id: "2",
      allergen: "Pencillin",
      type: "allergy",
      severity: "255604002",
      reaction: "Sneezing",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
    },
  ];

  beforeEach(() => {
    // Mock the API call or set the allergies data as needed
    cy.visit("/path/to/your/component");  // Adjust the URL to the correct page URL where AllergyTable is rendered
  });

  it("should render the table with headers correctly", () => {
    cy.get("table").within(() => {
      // Ensure the table headers are present
      cy.get("thead tr th").eq(0).should("contain.text", "Allergen");
      cy.get("thead tr th").eq(1).should("contain.text", "Type");
      cy.get("thead tr th").eq(2).should("contain.text", "Severity");
      cy.get("thead tr th").eq(3).should("contain.text", "Status");
      cy.get("thead tr th").eq(4).should("contain.text", "Reactions");
      cy.get("thead tr th").eq(5).should("contain.text", "Onset Date");
      cy.get("thead tr th").eq(6).should("contain.text", "Last Updated");
    });
  });

  it("should render rows correctly for each allergy", () => {
    cy.intercept("GET", "/api/allergies", allergies);  // Mocking the API call if needed
    cy.visit("/path/to/your/page");

    // Verify that each allergy row is rendered
    cy.get("tbody tr").should("have.length", allergies.length);

    // Check if the allergy data is displayed correctly in the table
    cy.get("tbody tr").eq(0).within(() => {
      cy.get("td").eq(0).should("contain.text", "Peanuts");
      cy.get("td").eq(1).should("contain.text", "allergy");
      cy.get("td").eq(2).should("contain.text", "255604002");
      cy.get("td").eq(3).should("contain.text", "active");
      cy.get("td").eq(4).should("contain.text", "test Reaction");
      cy.get("td").eq(5).should("contain.text", "2025-01-01 17:49:01");
      cy.get("td").eq(6).should("contain.text", "2025-01-31 17:49:04");
    });

    cy.get("tbody tr").eq(1).within(() => {
      cy.get("td").eq(0).should("contain.text", "Pencillin");
      cy.get("td").eq(1).should("contain.text", "allergy");
      cy.get("td").eq(2).should("contain.text", "255604002");
      cy.get("td").eq(3).should("contain.text", "active");
      cy.get("td").eq(4).should("contain.text", "test Reaction");
      cy.get("td").eq(5).should("contain.text", "2025-01-01 17:49:01");
      cy.get("td").eq(6).should("not.contain.text", "Last Updated");
    });
  });

  it("should render no rows when allergies data is empty", () => {
    cy.intercept("GET", "/api/allergies", []);  // Mock empty allergies data
    cy.visit("/path/to/your/page");

    cy.get("tbody tr").should("have.length", 0);
  });

  it("should render correct allergy data for each row", () => {
    cy.intercept("GET", "/api/allergies", allergies);
    cy.visit("/path/to/your/page");

    // Check for allergy data rendering
    cy.get("tbody tr").eq(0).should("contain.text", "Peanuts");
    cy.get("tbody tr").eq(0).should("contain.text", "allergy");
    cy.get("tbody tr").eq(0).should("contain.text", "255604002");
    cy.get("tbody tr").eq(0).should("contain.text", "test Reaction");

    cy.get("tbody tr").eq(1).should("contain.text", "Pencillin");
    cy.get("tbody tr").eq(1).should("contain.text", "allergy");
    cy.get("tbody tr").eq(1).should("contain.text", "255604002");
    cy.get("tbody tr").eq(1).should("contain.text", "test Reaction");
  });

  it("should display 'Active' status for allergies with an end date in the future or no end date", () => {
    cy.intercept("GET", "/api/allergies", allergies);
    cy.visit("/path/to/your/page");

    // Ensure that allergies that don't have an end date or have a future end date show 'Active'
    cy.get("tbody tr").eq(1).find("td").eq(3).should("contain.text", "active"); // Dust allergy, has no end date
    cy.get("tbody tr").eq(0).find("td").eq(3).should("contain.text", "active"); // Peanuts allergy, enddate is within past year
  });


  it("should show a button for 'Add Allergy'", () => {
    cy.intercept("GET", "/api/allergies", allergies);
    cy.visit("/path/to/your/page");

    // Check if the 'Add Allergy' button exists
    cy.get('button').contains("Add Allergy").should("exist");
  });

});
