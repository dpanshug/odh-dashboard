import { mockAcceleratorProfile } from '~/__mocks__/mockAcceleratorProfile';
import { mockClusterSettings } from '~/__mocks__/mockClusterSettings';
import { mockDashboardConfig } from '~/__mocks__/mockDashboardConfig';
import { mockDscStatus } from '~/__mocks__/mockDscStatus';
import { mockStatus } from '~/__mocks__/mockStatus';
import {
  acceleratorProfile,
  tolerationTable,
} from '~/__tests__/cypress/cypress/pages/acceleratorProfile';

const initIntercepts = () => {
  cy.intercept('/api/status', mockStatus());
  cy.intercept('/api/config', mockDashboardConfig({}));

  cy.intercept(
    {
      method: 'POST',
      pathname: '/api/accelerator-profiles',
    },
    mockAcceleratorProfile({
      displayName: 'accelerator123',
      description: 'Accelerator of identifier nvidia',
      tolerations: [],
    }),
  );
};

describe('Accelerator profiles', () => {
  it('Check empty page', () => {
    initIntercepts();
    acceleratorProfile.visit();
    acceleratorProfile.findEmptyResults();
  });

  describe('Add page', () => {
    beforeEach(() => {
      initIntercepts();
      acceleratorProfile.visit();
      acceleratorProfile.findCreateButton().click();
      cy.url().should('include', '/acceleratorProfiles/create');

      acceleratorProfile.findNameInput().type('accelerator123');
      acceleratorProfile.findIdentifierInput().type('nvidia.com/gpu');
      acceleratorProfile.findDescriptionInput().type('Accelerator of identifier nvidia');
    });

    it('Add new accelerator without tolerations', () => {
      acceleratorProfile.findSubmitButton().should('to.be.enabled');
      acceleratorProfile.findSubmitButton().click();
    });

    it('Add new accelerator with tolerations', () => {
      acceleratorProfile.findAddTolerationButton().click();
      acceleratorProfile.findKeyInput().type('123');
      acceleratorProfile.findTolerationSubmitButton().should('to.be.enabled');
      acceleratorProfile.findTolerationSubmitButton().click();

      describe('Tolerations', () => {
        it('Toleration edit', () => {
          tolerationTable.findRowByKey('123');
        });
      });
    });
  });

  it('Edit accelerator');
  it('View list of accelerators');
  it('Delete accelerator');
  it('Disable accelerator');
});
