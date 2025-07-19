import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { PyTorchJobKind } from '#~/k8sTypes';
import { getPyTorchJobState, getPyTorchJobStatusColor, PyTorchJobState } from '../utils';

type PyTorchJobStatusProps = {
  pytorchJob: PyTorchJobKind;
};

const PyTorchJobStatusLabel: React.FC<{ status?: PyTorchJobKind['status'] }> = ({ status }) => {
  const currentState = getPyTorchJobState(status);
  const color = getPyTorchJobStatusColor(currentState);

  return (
    <Label color={color} data-testid="pytorch-job-status-label">
      {currentState}
    </Label>
  );
};

const PyTorchJobStatus: React.FC<PyTorchJobStatusProps> = ({ pytorchJob }) => {
  const currentState = getPyTorchJobState(pytorchJob.status);
  const isCompleted =
    currentState === PyTorchJobState.SUCCEEDED || currentState === PyTorchJobState.FAILED;

  return (
    <div>
      <PyTorchJobStatusLabel status={pytorchJob.status} />
      {isCompleted && pytorchJob.status?.completionTime && (
        <div
          style={{
            fontSize: 'var(--pf-global--FontSize--xs)',
            color: 'var(--pf-global--Color--200)',
          }}
        >
          Completed: {new Date(pytorchJob.status.completionTime).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PyTorchJobStatus;
