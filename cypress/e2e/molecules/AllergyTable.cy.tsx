import React from "react";
import { mount } from "cypress/react";
import AllergyTable from '../../../src/components/molecules/AllergyTable'

describe('AllergyTable Component', () => {

  // Test Case 1: Check if skeleton loaders are visible when loading is true
  it('should display skeleton loaders when loading is true', () => {
    cy.mount(
      <AllergyTable allergies={[]} loading={true} />
    );

    // Check if skeleton loaders are visible
    cy.get('td').should('have.class', 'react-loading-skeleton');
    cy.get('td').should('have.length', 35); // 7 columns * 5 rows of skeletons
  });

  // Test Case 2: Check if an error message appears when allergies is not an array
  it('should display an error message if allergies is not an array', () => {
    cy.mount(
      <AllergyTable allergies={null} loading={false} />
    );

    // Check for the error message
    cy.contains('Error: Expected an array of allergies.').should('be.visible');
  });

  // Test Case 3: Check if "No allergies found" message appears for empty data
  it('should display "No allergies found" message if allergies array is empty', () => {
    cy.mount(
      <AllergyTable allergies={[]} loading={false} />
    );

    // Check for the "No allergies found" message
    cy.contains('No allergies found.').should('be.visible');
  });

  // Test Case 4: Check if allergy data is rendered correctly when allergies data is available
  it('should render allergy data correctly when allergies data is available', () => {
    const mockAllergies = [
      {
        id: '1',
        allergen: 'Peanuts',
        severity: { id: '1', title: 'Severe' },
        reaction: { id: '1', title: 'Anaphylaxis' },
        begdate: '2023-01-01',
        enddate: '2023-12-01',
        modified_by: { fname: 'John', lname: 'Doe' },
      },
      {
        id: '2',
        allergen: 'Dust',
        severity: { id: '2', title: 'Mild' },
        reaction: { id: '2', title: 'Sneezing' },
        begdate: '2022-05-01',
        enddate: null,
        modified_by: { fname: 'Jane', lname: 'Smith' },
      }
    ];

    cy.mount(
      <AllergyTable allergies={mockAllergies} loading={false} />
    );

    // Check if the allergy data is rendered correctly in the table
    cy.contains('Peanuts').should('be.visible');
    cy.contains('Severe').should('be.visible');
    cy.contains('Anaphylaxis').should('be.visible');
    cy.contains('John Doe').should('be.visible');

    cy.contains('Dust').should('be.visible');
    cy.contains('Mild').should('be.visible');
    cy.contains('Sneezing').should('be.visible');
    cy.contains('Jane Smith').should('be.visible');
  });

  // Test Case 5: Check if the table headers render correctly
  it('should render the table headers correctly', () => {
    cy.mount(
      <AllergyTable allergies={[]} loading={false} />
    );

    // Check if the table headers are rendered
    cy.get('th').eq(0).should('contain', 'Allergen');
    cy.get('th').eq(1).should('contain', 'Type');
    cy.get('th').eq(2).should('contain', 'Severity');
    cy.get('th').eq(3).should('contain', 'Status');
    cy.get('th').eq(4).should('contain', 'Reactions');
    cy.get('th').eq(5).should('contain', 'Onset Date');
    cy.get('th').eq(6).should('contain', 'Last Updated');
  });

  // Test Case 6: Check if the date format is rendered correctly (onset and last updated)
  it('should render formatted dates correctly', () => {
    const mockAllergies = [
      {
        id: '1',
        allergen: 'Peanuts',
        severity: { id: '1', title: 'Severe' },
        reaction: { id: '1', title: 'Anaphylaxis' },
        begdate: '2023-01-01T00:00:00Z',
        enddate: '2023-12-01T00:00:00Z',
        modified_by: { fname: 'John', lname: 'Doe' },
      }
    ];

    cy.mount(
      <AllergyTable allergies={mockAllergies} loading={false} />
    );

    // Check if the formatted dates are rendered correctly
    cy.contains('01/01/2023').should('be.visible');
    cy.contains('12/01/2023').should('be.visible');
  });

  // Test Case 7: Check if the reactions column displays properly
  it('should render reactions column correctly', () => {
    const mockAllergies = [
      {
        id: '1',
        allergen: 'Peanuts',
        severity: { id: '1', title: 'Severe' },
        reaction: { id: '1', title: 'Anaphylaxis' },
        begdate: '2023-01-01',
        enddate: '2023-12-01',
        modified_by: { fname: 'John', lname: 'Doe' },
      },
      {
        id: '2',
        allergen: 'Dust',
        severity: { id: '2', title: 'Mild' },
        reaction: null, // No reaction
        begdate: '2022-05-01',
        enddate: null,
        modified_by: { fname: 'Jane', lname: 'Smith' },
      }
    ];

    cy.mount(
      <AllergyTable allergies={mockAllergies} loading={false} />
    );

    // Check if the reaction column displays "No reaction" for empty reactions
    cy.contains('No reaction').should('be.visible');
    cy.contains('Anaphylaxis').should('be.visible');
  });
});

