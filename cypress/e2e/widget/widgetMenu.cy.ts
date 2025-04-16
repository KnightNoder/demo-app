describe('Widget Menu - Visibility and Toggle', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173');
    });
  
    it('shows the Widgets button and opens the widget menu with options', () => {
      // Check if the button is visible
      cy.contains('button', 'Widgets')
        .should('exist')
        .and('be.visible')
        .click();
  
      // Check if menu options appear
      cy.contains('h3', 'Add Widgets').should('be.visible');
      cy.contains('h3', 'Remove Widgets').should('be.visible');
  
      // Check search bar exists
      cy.get('input[placeholder="Search widgets..."]').should('exist');
    });
  });