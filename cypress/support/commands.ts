/// <reference types="cypress" />

// Custom commands for common testing operations

Cypress.Commands.add('login', (role: 'vet' | 'vet_tech' | 'admin' = 'vet') => {
  const credentials = {
    vet: { email: 'vet@example.com', password: 'password123' },
    vet_tech: { email: 'tech@example.com', password: 'password123' },
    admin: { email: 'admin@example.com', password: 'password123' },
  };

  cy.visit('/login');
  cy.get('input[name="email"]').type(credentials[role].email);
  cy.get('input[name="password"]').type(credentials[role].password);
  cy.get('button[type="submit"]').click();

  // Wait for redirect
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('createCase', (petName: string = 'Bella') => {
  cy.visit('/patients');
  cy.contains(petName).click();
  cy.contains('button', 'Start Intake').click();
  
  // Fill vitals
  cy.get('input[name="temperature"]').type('101.5');
  cy.get('input[name="heartRate"]').type('120');
  cy.get('input[name="respiratoryRate"]').type('30');
  cy.get('input[name="weight"]').type('65');
  
  // Select triage level
  cy.contains('button', 'Urgent').click();
  
  // Enter complaint
  cy.get('textarea[name="chiefComplaint"]').type('Vomiting and lethargy');
  
  // Submit
  cy.contains('button', 'Add to Queue').click();
});

// Type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      login(role?: 'vet' | 'vet_tech' | 'admin'): Chainable<void>;
      createCase(petName?: string): Chainable<void>;
    }
  }
}

export {};