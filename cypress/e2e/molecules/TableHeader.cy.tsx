/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import TableHeader from "../../../src/components/atoms/TableHeader/TableHeader"; // Adjust the import path accordingly

describe("TableHeader Component", () => {
  // Test that the TableHeader renders the correct text
  it("should render the children prop as text inside the th element", () => {
    const textContent = "Test Header";

    mount(<TableHeader>{textContent}</TableHeader>);

    cy.get("th").should("have.text", textContent);
  });

  it("should apply the custom className", () => {
    const customClass = "bg-gray-200";

    mount(<TableHeader className={customClass}>Test Header</TableHeader>);

    cy.get("th").should("have.class", customClass);
  });

  // Test the default font style
  it("should have default font style and text properties", () => {
    mount(<TableHeader>Test Header</TableHeader>);

    cy.get("th")
      .should("have.css", "font-family", '"Inter", sans-serif')
      .should("have.css", "font-feature-settings", '"rlig", "calt"')
      .should("have.css", "font-variation-settings", "normal");
  });

  it("should have proper alignment and padding", () => {
    mount(<TableHeader>Test Header</TableHeader>);

    cy.get("th")
      .should("have.css", "text-align", "center") // By default, th should align content to the center
      .should("have.css", "padding-left", "1px")
      .should("have.css", "padding-right", "2px");
  });
});

