// import React from "react";
// import Button from "../../src/components/atoms/Button/Button"; // Adjust the path to your Button component
// import { mount } from "cypress/react";

describe('Button Component', () => {
  beforeEach(() => {
    cy.visit('/'); // Update with your actual path
  });

  it('should render with primary variant and correct styles', () => {
    cy.get('[data-cy="primary-button"]') // Assuming the button has a `data-cy="primary-button"` attribute
      .should('exist')
      .and('have.class', 'text-[#0093D3]') // Check for the primary text color
      .and('have.class', 'bg-transparent'); // Check for the default background
  });

  it('should render with secondary variant and correct styles', () => {
    cy.get('[data-cy="secondary-button"]') // Assuming the button has a `data-cy="secondary-button"` attribute
      .should('exist')
      .and('have.class', 'text-[#0093D3]')
      .and('have.class', 'bg-transparent');
  });

  it('should render the button with text children', () => {
    cy.get('[data-cy="default-button"]') // Assuming a default button
      .should('contain.text', 'Click Me'); // Replace with actual text
  });

  it('should render the button with an "add" icon', () => {
    cy.get('[data-cy="button-with-add-icon"]') // Assuming a button with add icon
      .find('svg') // Assuming the icon is an SVG element
      .should('exist') // Check if the icon exists
      .and('have.attr', 'data-icon', 'add'); // Check the icon data
  });

  it('should render the button with a "view" icon', () => {
    cy.get('[data-cy="button-with-view-icon"]') // Assuming a button with view icon
      .find('svg') // Assuming the icon is an SVG element
      .should('exist') // Check if the icon exists
      .and('have.attr', 'data-icon', 'view'); // Check the icon data
  });

});

