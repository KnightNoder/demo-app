/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import DraggableCard from "../../../src/components/organisms/Card/Card"; // Adjust the import path accordingly

describe("DraggableCard Component", () => {
  it("should render the draggable card with the correct title", () => {
    const initialPosition = { x: 100, y: 100 };

    // Mount the DraggableCard component with a title and children
    mount(
      <DraggableCard title="Test Draggable Card" initialPosition={initialPosition}>
        <p>Card content goes here.</p>
      </DraggableCard>
    );

    // Check if the card title is rendered correctly
    cy.contains("Test Draggable Card").should("exist");

    // Check if the card content is rendered
    cy.contains("Card content goes here.").should("exist");
  });
});
