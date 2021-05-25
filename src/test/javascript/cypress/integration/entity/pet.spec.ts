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

describe('Pet e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Pets', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Pet').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Pet page', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('pet');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Pet page', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Pet');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Pet page', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Pet');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Pet', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Pet');

    cy.get(`[data-cy="name"]`)
      .type('Coordinator multimedia', { force: true })
      .invoke('val')
      .should('match', new RegExp('Coordinator multimedia'));

    cy.get(`[data-cy="birthDate"]`).type('2021-05-25').should('have.value', '2021-05-25');

    cy.setFieldSelectToLastOfEntity('type');

    cy.setFieldSelectToLastOfEntity('owner');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/pets*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Pet', () => {
    cy.intercept('GET', '/api/pets*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/pets/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('pet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/pets*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('pet');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
