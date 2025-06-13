import { mockK8sResourceList } from '#~/__mocks__/mockK8sResourceList';
import { mockProjectK8sResource } from '#~/__mocks__/mockProjectK8sResource';
import { ProjectModel } from '#~/__tests__/cypress/cypress/utils/models';
import { LMEvalModel } from '#~/api/models';
import { verifyRelativeURL } from '#~/__tests__/cypress/cypress/utils/url';
import { lmEvalPage } from '#~/__tests__/cypress/cypress/pages/lmEval/lmEvalPage';
import { mockDashboardConfig } from '#~/__mocks__/mockDashboardConfig.ts';
import { mockDscStatus } from '#~/__mocks__/mockDscStatus.ts';

describe('LM Evaluation Home Page', () => {
  it('model evaluation tab is invisible when trustyai is not installed', () => {
    initIntercepts({ isTrustyAIInstalled: false });
    lmEvalPage.visit('test-project', false);
    lmEvalPage.findPageTitle().should('not.exist');
  });

  it('should show empty state when no evaluations exist', () => {
    initIntercepts({});
    lmEvalPage.visit('test-project');

    lmEvalPage.findPageTitle().should('have.text', 'Model evaluations');
    lmEvalPage.findEmptyStateTitle().should('contain.text', 'No evaluations on this project');
    lmEvalPage
      .findEmptyStateBody()
      .should('contain.text', 'No evaluations have been generated within this project');

    lmEvalPage.findEvaluateModelButton().should('exist');
  });

  it('should show empty state when no projects exist', () => {
    initIntercepts({});
    cy.interceptK8sList(ProjectModel, mockK8sResourceList([]));
    lmEvalPage.visit();

    lmEvalPage.findEmptyStateTitle().should('contain.text', 'No data science projects');
    lmEvalPage
      .findEmptyStateBody()
      .should('contain.text', 'To view model evaluations, first create a data science project.');

    // Verify Create project button exists
    lmEvalPage.findCreateProjectButton().should('exist');
  });

  it('should verify model evaluation is invisible when feature flag is disabled', () => {
    initIntercepts({});
    // Mock feature flag disabled
    initIntercepts({ disableLMEval: true });

    // Visit the LM Evaluation page
    lmEvalPage.visit(undefined, false);

    // Verify feature is disabled
    lmEvalPage.findPageTitle().should('not.exist');
  });

  it('should verify URL for model evaluation form', () => {
    initIntercepts({});
    // Mock project and empty evaluations
    cy.interceptK8sList(ProjectModel, mockK8sResourceList([mockProjectK8sResource({})]));
    cy.interceptK8sList(LMEvalModel, mockK8sResourceList([]));

    // Visit the LM Evaluation page
    lmEvalPage.visit('test-project');

    // Verify URL
    verifyRelativeURL('/modelEvaluations/test-project');

    // Click Evaluate model button
    lmEvalPage.findEvaluateModelButton().click();

    // Verify URL changes to evaluate page
    verifyRelativeURL('/modelEvaluations/test-project/evaluate');
  });
});

type InitInterceptsProps = {
  disableLMEval?: boolean;
  isTrustyAIInstalled?: boolean;
};

const initIntercepts = ({
  disableLMEval = false,
  isTrustyAIInstalled = true,
}: InitInterceptsProps): void => {
  cy.interceptOdh(
    'GET /api/dsc/status',
    mockDscStatus({
      installedComponents: {
        trustyai: isTrustyAIInstalled,
      },
    }),
  );
  // Mock dashboard config
  cy.interceptOdh(
    'GET /api/config',
    mockDashboardConfig({
      disableLMEval,
    }),
  );
  cy.interceptK8sList(LMEvalModel, mockK8sResourceList([]));
  // Mock projects list
  cy.interceptK8sList(
    ProjectModel,
    mockK8sResourceList([
      mockProjectK8sResource({
        k8sName: 'test-project',
        displayName: 'Test Project',
      }),
    ]),
  );

  cy.interceptK8sList(LMEvalModel, mockK8sResourceList([]));
};
