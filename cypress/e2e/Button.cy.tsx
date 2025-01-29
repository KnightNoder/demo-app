import React from "react";
import Button from "../../src/components/atoms/Button/Button"; // Adjust the path to your Button component
import { mount } from "cypress/react";

describe("Button Component", () => {
  it("renders the button with default props", () => {
    mount(<Button>Click Me</Button>);
    cy.get("button")
      .should("have.class", "cursor-pointer")
      .and("contain.text", "Click Me");
  });

  it("applies primary variant styles", () => {
    mount(<Button variant="primary">Primary</Button>);
    cy.get("button").should(
      "have.class",
      "bg-blue-500 text-white hover:bg-blue-600"
    );
  });

  it("handles click events", () => {
    const onClick = cy.stub();
    mount(<Button onClick={onClick}>Click Me</Button>);
    cy.get("button")
      .click()
      .then(() => {
        expect(onClick).to.have.been.calledOnce;
      });
  });
});
