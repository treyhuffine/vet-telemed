describe('Patient Intake Flow', () => {
  beforeEach(() => {
    cy.login('vet_tech');
  });

  it('completes full intake process', () => {
    // Navigate to patients
    cy.visit('/patients');
    cy.contains('Patient Management').should('be.visible');

    // Search for a patient
    cy.get('input[placeholder*="Search"]').type('Bella');
    cy.contains('.grid', 'Bella').should('be.visible');

    // Click on patient
    cy.contains('.grid', 'Bella').click();

    // Start intake
    cy.contains('button', 'Start Intake').click();

    // Fill vitals
    cy.get('input[name="temperature"]').type('101.5');
    cy.get('input[name="heartRate"]').type('120');
    cy.get('input[name="respiratoryRate"]').type('30');
    cy.get('input[name="weight"]').clear().type('65');

    // Select mucous membrane color
    cy.get('select[name="mmColor"]').select('Pink (Normal)');

    // Select triage level
    cy.contains('Urgent').click();
    cy.contains('Moderate pain, vomiting').should('be.visible');

    // Enter chief complaint
    cy.get('textarea[name="chiefComplaint"]').type('Patient has been vomiting for 2 days and appears lethargic');

    // Add photo (simulate)
    cy.contains('button', 'Add Photo').should('be.visible');

    // Submit
    cy.contains('button', 'Add to Queue').click();

    // Verify redirect to queue
    cy.url().should('include', '/queue');
    cy.contains('Case added successfully').should('be.visible');
  });

  it('validates vital signs ranges', () => {
    cy.createCase();

    // Enter out-of-range temperature
    cy.visit('/patients');
    cy.contains('Max').click();
    cy.contains('button', 'Start Intake').click();

    cy.get('input[name="temperature"]').type('110'); // Too high
    cy.get('input[name="temperature"]').should('have.class', 'border-yellow-500');

    cy.get('input[name="heartRate"]').type('250'); // Too high
    cy.get('input[name="heartRate"]').should('have.class', 'border-yellow-500');
  });

  it('auto-saves intake data', () => {
    cy.visit('/patients');
    cy.contains('Charlie').click();
    cy.contains('button', 'Start Intake').click();

    // Enter some data
    cy.get('input[name="temperature"]').type('102.0');
    cy.get('input[name="heartRate"]').type('110');

    // Wait for auto-save
    cy.wait(2000);
    cy.contains('Saved').should('be.visible');

    // Navigate away and back
    cy.visit('/patients');
    cy.contains('Charlie').click();
    cy.contains('button', 'Start Intake').click();

    // Data should be preserved
    cy.get('input[name="temperature"]').should('have.value', '102.0');
    cy.get('input[name="heartRate"]').should('have.value', '110');
  });

  it('requires triage level selection', () => {
    cy.visit('/patients');
    cy.contains('Luna').click();
    cy.contains('button', 'Start Intake').click();

    // Fill vitals but don't select triage
    cy.get('input[name="temperature"]').type('101.5');
    cy.get('input[name="heartRate"]').type('120');
    cy.get('input[name="respiratoryRate"]').type('30');
    cy.get('input[name="weight"]').type('45');

    // Try to submit
    cy.contains('button', 'Add to Queue').click();

    // Should show error
    cy.contains('Please select a triage level').should('be.visible');
  });
});