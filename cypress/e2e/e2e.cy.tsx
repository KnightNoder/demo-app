import React from "react";
import { mount } from "cypress/react";

// cypress/e2e/card.spec.tsx

describe("Card Component", () => {
  beforeEach(() => {
    // Visit the specific port where your application is running
    cy.visit("http://localhost:5173");

    // Adding a small wait to ensure the page is fully loaded
    cy.wait(1000);
  });

  it("should verify the page loads successfully", () => {
    // This test simply verifies that the page loads and contains some element
    cy.get("body").should("be.visible");
  });

  it("should be able to interact with the page", () => {
    // This test performs a very basic interaction
    cy.get("body").click(10, 10, { force: true });

    // Verify the page still exists after interaction
    cy.get("html").should("exist");
  });
});





