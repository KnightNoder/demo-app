import React from "react";
import { mount } from "cypress/react";


describe("Dashboard Widgets Test", () => {
  const Widgets = [
    { name: "Allergies", addText: "Add Allergy" },
    { name: "Diagnosis", addText: "Add Diagnosis" },
    { name: "Clinical Notes", addText: "Add Clinical Note" },
    { name: "Insurance", addText: "Add Insurance" },
    { name: "Medications", addText: "Add Medication" },
  ];

  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  // it("should render all widgets and their actions", () => {
  //   Widgets.forEach(({ name, addText }) => {
  //     cy.contains(name, { matchCase: false }).should("be.visible");
  //     cy.contains(addText, { matchCase: false }).should("be.visible");
  //     cy.contains("View History", { matchCase: false })
  //       .should("be.visible")
  //       .closest("[data-testid=draggable-card]")
  //       .within(() => {
  //         cy.get("[data-testid=expand-icon]").should("be.visible");
  //         cy.get("[data-testid=collapse-button]").should("be.visible");
  //       });
  //   });
  // });

  it("should collapse and expand each widget", () => {
    Widgets.forEach(({ name }) => {
      cy.contains(name)
        .closest(".drag-handle")
        .within(() => {
          cy.get("[data-testid='collapse-button']").click();
          cy.wait(500); // Observe collapse
          cy.get("[data-testid='collapse-button']").click();
          cy.wait(500); // Observe expand
        });
    });
  });

  it("should drag and move cards", () => {
    cy.get("[data-testid='draggable-card']")
      .first()
      .then(($card) => {
        const initialRect = $card[0].getBoundingClientRect();

        cy.wrap($card)
          .trigger("mousedown", { button: 0 })
          .trigger("mousemove", {
            clientX: initialRect.left + 100,
            clientY: initialRect.top + 100,
          })
          .wait(500) // Observe drag
          .trigger("mouseup");

        cy.wrap($card).then(($newCard) => {
          const newRect = $newCard[0].getBoundingClientRect();
          expect(newRect.left).not.to.equal(initialRect.left);
          expect(newRect.top).not.to.equal(initialRect.top);
        });
      });
  });

  it("should expand and close each widget modal", () => {
    cy.get("[data-testid=expand-icon]").each(($icon) => {
      cy.wrap($icon)
        .click()
        .wait(1000) // Allow animation time
        .then(() => {
          cy.get("[data-testid=modal]").should("be.visible");
        })
        .wait(1000)
        .then(() => {
          cy.get("[data-testid=modal-close]").click();
        })
        .wait(1000)
        .then(() => {
          cy.get("[data-testid=modal]").should("not.exist");
        });
    });
  });

});





