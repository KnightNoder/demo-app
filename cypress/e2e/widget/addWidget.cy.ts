describe('Widget Menu - Add Widget', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173');
      cy.contains('button', 'Widgets').click();
    });
  
    it('adds Vitals widget to Remove Widgets list', () => {
      const widgetName = 'Vitals';
  
      // Search outside any scoped within()
      cy.get('input[placeholder="Search widgets..."]').clear().type(widgetName);
  
      // Click + button for widget
      cy.contains('Add Widgets')
        .parent()
        .contains(widgetName)
        .closest('li')
        .find('button')
        .click({ force: true });
  
      // Confirm widget shows up in Remove Widgets
      cy.contains('Remove Widgets')
        .parent()
        .should('contain', widgetName);
    });
  });
  