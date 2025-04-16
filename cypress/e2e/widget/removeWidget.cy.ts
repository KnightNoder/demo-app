describe('Widget Menu - Remove Widget', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173');
      cy.contains('button', 'Widgets').click();
  
      // Precondition: Add widget first to simulate it's already present
      const widgetName = 'Vitals';
      cy.contains('Add Widgets')
        .parent()
        .within(() => {
          cy.contains(widgetName)
            .closest('li')
            .find('button')
            .click({ force: true });
        });
    });
  
    it('removes Vitals widget and returns it to Add Widgets list', () => {
      const widgetName = 'Vitals';
  
      cy.contains('Remove Widgets')
        .parent()
        .within(() => {
          cy.contains(widgetName)
            .closest('li')
            .find('button')
            .click({ force: true });
        });
  
      cy.contains('Remove Widgets')
        .parent()
        .should('not.contain', widgetName);
  
      cy.contains('Add Widgets')
        .parent()
        .should('contain', widgetName);
    });
  });
  