describe('Button Component', () => {

  it('should render the primary button variant with correct classes', () => {
    // Select button with primary variant and check if it contains correct text
    cy.get('button')
      .contains('Primary Button', { timeout: 10000 }) // Ensure we wait for the button to render
      .should('exist')
      .should('have.class', 'text-[#0093D3]') // Check for primary text color
      .and('have.class', 'underline-offset-4') // Check for correct underline offset
      .and('have.class', 'hover:underline') // Check for hover effect
      .and('have.class', 'h-7') // Check height of the button
      .and('have.class', 'rounded-md'); // Check for border radius
  });

  it('should render the secondary button variant with correct classes', () => {
    // Select button with secondary variant and check if it contains correct text
    cy.get('button')
      .contains('Secondary Button', { timeout: 10000 }) // Ensure we wait for the button to render
      .should('exist')
      .should('have.class', 'text-[#0093D3]') // Check secondary button text color
      .and('have.class', 'hover:underline') // Check hover effect
      .and('have.class', 'h-7') // Check height of the button
      .and('have.class', 'rounded-md'); // Check border radius
  });

  it('should render the default button variant with transparent background', () => {
    // Select button with default variant and check if it contains correct text
    cy.get('button')
      .contains('Default Button', { timeout: 10000 }) // Ensure we wait for the button to render
      .should('exist')
      .should('have.class', 'bg-transparent') // Check for transparent background
      .and('have.class', 'text-[#0093D3]') // Check text color
      .and('have.class', 'h-7') // Check height of the button
      .and('have.class', 'rounded-md'); // Check for border radius
  });

  it('should disable button when disabled prop is passed', () => {
    cy.get('button')
      .contains('Primary Button', { timeout: 10000 })
      .should('exist')
      .and('be.disabled'); // Ensure the button is disabled
  });

  it('should display button with an icon when icon prop is provided', () => {
    cy.get('button')
      .contains('Primary Button', { timeout: 10000 })
      .should('exist')
      .find('svg') // Check for the icon (assuming it's an svg)
      .should('exist'); // Ensure icon exists within the button
  });

  it('should not be clickable when disabled', () => {
    cy.get('button')
      .contains('Primary Button', { timeout: 10000 })
      .should('exist')
      .and('be.disabled')
      .click({ force: true }) // Try clicking while disabled
      .should('not.be.called'); // Ensure click handler is not called
  });
});
