import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Owner e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Owners', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Owner').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Owner page', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('owner');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Owner page', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Owner');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Owner page', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Owner');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Owner', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Owner');

    cy.get(`[data-cy="firstName"]`).type('Ike', { force: true }).invoke('val').should('match', new RegExp('Ike'));

    cy.get(`[data-cy="lastName"]`).type('Steuber', { force: true }).invoke('val').should('match', new RegExp('Steuber'));

    cy.get(`[data-cy="address"]`).type('Well', { force: true }).invoke('val').should('match', new RegExp('Well'));

    cy.get(`[data-cy="city"]`).type('Stehrton', { force: true }).invoke('val').should('match', new RegExp('Stehrton'));

    cy.get(`[data-cy="telephone"]`).type('990.860.3540', { force: true }).invoke('val').should('match', new RegExp('990.860.3540'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/owners*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Owner', () => {
    cy.intercept('GET', '/api/owners*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/owners/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('owner').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/owners*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('owner');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
