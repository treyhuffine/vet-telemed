describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login form', () => {
    cy.contains('Welcome back').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('shows validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('logs in as veterinarian', () => {
    cy.get('input[name="email"]').type('vet@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Queue Dashboard').should('be.visible');
  });

  it('logs in as vet tech', () => {
    cy.get('input[name="email"]').type('tech@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Queue Dashboard').should('be.visible');
  });

  it('logs in as admin', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin');
    cy.contains('Analytics Dashboard').should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('logs out successfully', () => {
    // First login
    cy.login('vet');

    // Find and click logout
    cy.get('button[aria-label="User menu"]').click();
    cy.contains('Logout').click();

    // Should redirect to login
    cy.url().should('include', '/login');
  });
});