import React from "react";
import { mount } from "cypress/react";
import TableCell from "../../../src/components/atoms/TableCell/TableCell";

describe('TableCell Component', () => {

  it('should render TableCell with provided children', () => {
    // Render the TableCell with children and verify the content
    cy.mount(<TableCell>Test Content</TableCell>);

    cy.get('td')
      .should('exist')
      .should('contain.text', 'Test Content'); // Ensure the content is rendered inside the td
  });

  it('should have the correct default classes applied', () => {
    // Render the TableCell without custom classes
    cy.mount(<TableCell>Test Content</TableCell>);

    cy.get('td')
      .should('have.class', 'py-2')
      .and('have.class', 'px-2')
      .and('have.class', 'my-10')
      .and('have.class', 'text-[12px]')
      .and('have.class', 'align-middle')
      .and('have.class', 'text-center'); // Ensure default styles are applied
  });

  it('should apply custom classes passed via className prop', () => {
    // Render the TableCell with a custom class
    cy.mount(<TableCell className="custom-class">Custom Class Test</TableCell>);

    cy.get('td')
      .should('exist')
      .should('contain.text', 'Custom Class Test') // Ensure the content is rendered
      .and('have.class', 'custom-class'); // Ensure the custom class is applied
  });

  it('should render multiple children correctly', () => {
    // Render TableCell with multiple children (e.g., string and another component)
    cy.mount(
      <TableCell>
        <span>Test Span</span>
        Test Text
      </TableCell>
    );

    cy.get('td')
      .should('exist')
      .should('contain.text', 'Test Span')
      .and('contain.text', 'Test Text'); // Ensure all children content is rendered correctly
  });

  it('should be responsive to different screen sizes', () => {
    // Check if the TableCell adjusts properly on small screens (using Cypress's viewport)
    cy.viewport('iphone-6'); // Adjust the viewport to a small screen

    cy.mount(<TableCell>Responsive Test</TableCell>);

    cy.get('td')
      .should('exist')
      .should('contain.text', 'Responsive Test'); // Ensure the content is still rendered

    // Check if the content is still centered (if it needs to be centered on mobile)
    cy.get('td').should('have.css', 'text-align', 'center');
  });

});
