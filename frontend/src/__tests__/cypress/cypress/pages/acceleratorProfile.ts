import { appChrome } from '~/__tests__/cypress/cypress/pages/appChrome';

class AcceleratorProfile {
  visit() {
    cy.visitWithLogin('/acceleratorProfiles');
    this.wait();
  }

  navigate() {
    appChrome.findNavItem('Accelerator profiles', 'Settings').click();
    this.wait();
  }

  private wait() {
    cy.findByRole('button', { name: 'Add new accelerator profile' });
    cy.testA11y();
  }

  findEmptyResults() {
    return cy.findByRole('heading', { name: 'No available accelerator profiles yet' });
  }

  findCreateButton() {
    return cy.findByTestId('display-accelerator-modal-button');
  }

  findNameInput() {
    return cy.findByTestId('accelerator-name-input');
  }

  findIdentifierInput() {
    return cy.findByTestId('accelerator-identifier-input');
  }

  findDescriptionInput() {
    return cy.findByTestId('accelerator-description-input');
  }

  findSubmitButton() {
    return cy.findByTestId('accelerator-profile-create-button');
  }

  findAddTolerationButton() {
    return cy.findByTestId('add-toleration-button');
  }

  findKeyInput() {
    return cy.findByTestId('toleration-key-input');
  }

  findTolerationSubmitButton() {
    return cy.findByTestId('modal-submit-button');
  }
}

class TolerationTable extends AcceleratorProfile {
  findTable() {
    return cy.findByRole('grid');
  }

  findRowByKey(key: string) {
    return this.findTable().find('[data-label=Key]').contains(key).parents('tr');
  }
}

export const acceleratorProfile = new AcceleratorProfile();
export const tolerationTable = new TolerationTable();
