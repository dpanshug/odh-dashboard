import React, { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { InferenceServiceModelState } from '@odh-dashboard/internal/pages/modelServing/screens/types';
import { Deployment } from '../../../../extension-points';
import { mockExtensions } from '../../../__tests__/mockUtils';
import { DeploymentRow } from '../DeploymentsTableRow';

jest.mock('@odh-dashboard/plugin-core');

const mockDeployment = (partial: Partial<Deployment> = {}) => ({
  modelServingPlatformId: 'test-platform',
  model: {
    apiVersion: 'v1',
    kind: 'TestModelKind',
    metadata: {
      name: 'test-deployment',
      namespace: 'test-project',
    },
  },
  server: partial.server,
  status: partial.status,
  endpoints: partial.endpoints,
});

describe('DeploymentsTableRow', () => {
  let onDelete: jest.Mock;
  let onEdit: jest.Mock;

  beforeEach(() => {
    onDelete = jest.fn();
    onEdit = jest.fn();
    mockExtensions();
  });

  it('should render the basic row', async () => {
    render(
      <table>
        <DeploymentRow
          deployment={mockDeployment({})}
          platformColumns={[]}
          onDelete={onDelete}
          onEdit={onEdit}
          rowIndex={0}
        />
      </table>,
    );

    // Name Column
    expect(screen.getByRole('cell', { name: 'test-deployment' })).toBeInTheDocument();
    // Name Column - More info button
    expect(screen.getByRole('button', { name: 'More info' })).toBeInTheDocument();
    // Inference endpoint Column
    expect(screen.getByText('Failed to get endpoint for this deployed model.')).toBeInTheDocument();
    // API protocol Column
    expect(screen.getByText('Not defined')).toBeInTheDocument();
    // Status Column
    expect(screen.getByText('Inference Service Status')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Kebab toggle' }));
    });
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalled();
  });

  it('should render with platform columns', () => {
    render(
      <table>
        <DeploymentRow
          deployment={mockDeployment({})}
          platformColumns={[
            {
              label: 'Platform',
              field: 'platform',
              sortable: false,
              cellRenderer: () => 'test-data',
            },
          ]}
          onDelete={onDelete}
          onEdit={onEdit}
          rowIndex={0}
        />
      </table>,
    );

    expect(screen.getByText('test-data')).toBeInTheDocument();
  });

  it('should render the row with a status', () => {
    render(
      <table>
        <DeploymentRow
          deployment={mockDeployment({
            status: { state: InferenceServiceModelState.LOADED },
          })}
          platformColumns={[]}
          onDelete={onDelete}
          onEdit={onEdit}
          rowIndex={0}
        />
      </table>,
    );

    expect(screen.getByText('Started')).toBeInTheDocument();
  });

  describe('Inference endpoints', () => {
    it('should render the row with internal inference endpoint', async () => {
      render(
        <table>
          <DeploymentRow
            deployment={mockDeployment({
              endpoints: [
                {
                  type: 'internal',
                  name: 'test-endpoint',
                  url: 'https://internal-endpoint.com',
                },
              ],
            })}
            platformColumns={[]}
            onDelete={onDelete}
            onEdit={onEdit}
            rowIndex={0}
          />
        </table>,
      );

      const button = screen.getByRole('button', { name: 'Internal endpoint details' });
      expect(button).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(button);
      });
      expect(screen.getByText('https://internal-endpoint.com')).toBeInTheDocument();
    });

    it('should render the row with external inference endpoint', async () => {
      render(
        <table>
          <DeploymentRow
            deployment={mockDeployment({
              endpoints: [
                {
                  type: 'external',
                  name: 'test-endpoint',
                  url: 'https://external-endpoint.com',
                },
              ],
            })}
            platformColumns={[]}
            onDelete={onDelete}
            onEdit={onEdit}
            rowIndex={0}
          />
        </table>,
      );

      const button = screen.getByRole('button', { name: 'Internal and external endpoint details' });
      expect(button).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(button);
      });
      expect(screen.getByText('https://external-endpoint.com')).toBeInTheDocument();
    });

    it('should render the row with multiple inference endpoints', async () => {
      render(
        <table>
          <DeploymentRow
            deployment={mockDeployment({
              endpoints: [
                {
                  type: 'internal',
                  name: 'test-endpoint',
                  url: 'https://internal-endpoint.com',
                },
                {
                  type: 'external',
                  name: 'test-endpoint',
                  url: 'https://external-endpoint.com',
                },
              ],
            })}
            platformColumns={[]}
            onDelete={onDelete}
            onEdit={onEdit}
            rowIndex={0}
          />
        </table>,
      );

      const button = screen.getByRole('button', { name: 'Internal and external endpoint details' });
      expect(button).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(button);
      });
      expect(screen.getByText('https://internal-endpoint.com')).toBeInTheDocument();
      expect(screen.getByText('https://external-endpoint.com')).toBeInTheDocument();
    });
  });

  it('should render the row with an api protocol', () => {
    render(
      <table>
        <DeploymentRow
          deployment={mockDeployment({
            server: {
              apiVersion: 'v1',
              kind: 'TestServerKind',
              metadata: {
                name: 'test-server',
                namespace: 'test-project',
                annotations: {
                  'opendatahub.io/apiProtocol': 'REST',
                },
              },
            },
          })}
          platformColumns={[]}
          onDelete={onDelete}
          onEdit={onEdit}
          rowIndex={0}
        />
      </table>,
    );

    expect(screen.getByText('REST')).toBeInTheDocument();
  });
});
