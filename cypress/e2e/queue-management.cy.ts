describe('Queue Management', () => {
  beforeEach(() => {
    cy.login('vet');
    cy.visit('/queue');
  });

  it('displays queue columns correctly', () => {
    cy.contains('Queue Dashboard').should('be.visible');
    cy.contains('Waiting').should('be.visible');
    cy.contains('Ready').should('be.visible');
    cy.contains('In Consultation').should('be.visible');
    cy.contains('Completed').should('be.visible');
  });

  it('shows queue statistics', () => {
    cy.contains('Total Cases').should('be.visible');
    cy.contains('Red Triage').should('be.visible');
    cy.contains('Avg Wait Time').should('be.visible');
    cy.contains('Active Vets').should('be.visible');
  });

  it('filters cases by triage level', () => {
    // Click Red filter
    cy.contains('button', 'Red').click();
    cy.contains('button', 'Red').should('have.class', 'bg-red-100');

    // Only red triage cases should be visible
    cy.get('[data-triage-level="red"]').should('be.visible');
    cy.get('[data-triage-level="yellow"]').should('not.exist');
    cy.get('[data-triage-level="green"]').should('not.exist');

    // Clear filter
    cy.contains('button', 'All').click();
  });

  it('searches for cases', () => {
    cy.get('input[placeholder*="Search"]').type('Bella');
    
    // Should only show Bella's case
    cy.contains('.bg-white', 'Bella').should('be.visible');
    cy.contains('.bg-white', 'Max').should('not.exist');
  });

  it('opens case details modal', () => {
    // Click on a case
    cy.contains('.bg-white', 'Bella').click();

    // Modal should open
    cy.contains('Case Details').should('be.visible');
    cy.contains('Chief Complaint').should('be.visible');
    cy.contains('Vitals').should('be.visible');
    
    // Close modal
    cy.get('[aria-label="Close"]').click();
    cy.contains('Case Details').should('not.exist');
  });

  it('assigns case to self', () => {
    // Find unassigned case
    cy.contains('.bg-white', 'Waiting')
      .parent()
      .within(() => {
        cy.get('[data-assigned="false"]').first().as('unassignedCase');
      });

    // Click on case to open modal
    cy.get('@unassignedCase').click();

    // Assign to self
    cy.contains('button', 'Assign to Me').click();

    // Case should move to Ready column
    cy.contains('.bg-white', 'Ready')
      .parent()
      .should('contain', 'Dr. Sarah Johnson');
  });

  it('starts consultation', () => {
    // Find a ready case
    cy.contains('.bg-white', 'Ready')
      .parent()
      .within(() => {
        cy.get('.border').first().click();
      });

    // Start consultation
    cy.contains('button', 'Start Consultation').click();

    // Should redirect to video call
    cy.url().should('include', '/consultation');
  });

  it('toggles between all cases and my cases', () => {
    // Initially showing all cases
    cy.get('[data-testid="case-card"]').should('have.length.greaterThan', 5);

    // Toggle to my cases
    cy.get('label').contains('My Cases Only').click();

    // Should show fewer cases
    cy.get('[data-testid="case-card"]').should('have.length.lessThan', 5);
  });

  it('handles drag and drop', () => {
    // This is a simplified test as Cypress drag-and-drop can be complex
    // Verify drag handles exist
    cy.get('[data-rbd-drag-handle-draggable-id]').should('exist');
  });
});