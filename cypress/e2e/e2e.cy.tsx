import React from "react";
import { mount } from "cypress/react";

// describe("Dashboard Cards Rendering", () => {
//   const cards = [
//     { name: "Allergies", addText: "Add Allergy" },
//     { name: "Diagnosis", addText: "Add Diagnosis" },
//     { name: "Clinical Notes", addText: "Add Clinical Note" },
//     { name: "Insurance", addText: "Add Insurance" },
//     { name: "Medications", addText: "Add Medication" }
//   ];

//   beforeEach(() => {
//     cy.visit("http://localhost:5173");
//     cy.wait(500); // Wait for the UI to settle
//   });

//   it("Check all cards are rendered", () => {
//     cards.forEach(({ name }) => {
//       cy.contains(name, { matchCase: false }).should("be.visible");
//     });
//   });

//   cards.forEach(({ name }) => {
//     it(`Check "${name}" card is rendered`, () => {
//       cy.contains(name, { matchCase: false }).should("be.visible");
//     });

//     it(`Check "Add ${name}" button is present`, () => {
//       cy.contains(name, { matchCase: false }).should("be.visible");
//     });

//     it(`Check "View History" button is present in "${name}" card`, () => {
//       cy.contains(name, { matchCase: false }).should("be.visible");
//     });
//   });

//   // Adding the collapse test cases inside the same describe block


// });

describe("DraggableCard Collapse Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should collapse the 'Allergies' card when clicking its collapse icon", () => {
    cy.contains("Allergies")
      .closest(".drag-handle")
      .within(() => {
        cy.get("[data-testid='collapse-button']").click();
      });
  });

  it("should expand the 'Allergies' card when clicking the collapse icon again", () => {
    cy.contains("Allergies")
      .closest(".drag-handle") // Ensure the test only affects one card
      .within(() => {
        cy.get("[data-testid='collapse-button']").click(); // Collapse
        cy.get("[data-testid='collapse-button']").click(); // Expand
      });
  });

  it("should expand the card when clicking the collapse icon again", () => {
    // Collapse first
    cy.contains("Allergies")
      .parent()
      .within(() => {
        cy.get("[data-testid='collapse-button']").click();
      });

    // Expand again
    cy.contains("Allergies")
      .parent()
      .within(() => {
        cy.get("[data-testid='collapse-button']").click();
      });

  });
});