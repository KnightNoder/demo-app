import React from "react";
import { mount } from "cypress/react";
import TableCell from "../../../src/components/atoms/TableCell/TableCell";

describe("TableCell Component", () => {
  it("renders children correctly", () => {
    mount(<TableCell>Test Content</TableCell>);

    cy.get("td").should("contain.text", "Test Content");
  });

  it("applies custom class name", () => {
    mount(<TableCell className="custom-class">Styled Cell</TableCell>);

    cy.get("td").should("have.class", "custom-class");
  });
});
