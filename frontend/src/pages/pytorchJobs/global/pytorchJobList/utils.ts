import { PyTorchJobKind } from '#~/k8sTypes';

export enum PyTorchJobState {
  PENDING = 'Pending',
  CREATED = 'Created',
  RUNNING = 'Running',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
  RESTARTING = 'Restarting',
  UNKNOWN = 'Unknown',
}

export const getPyTorchJobState = (status?: PyTorchJobKind['status']): PyTorchJobState => {
  if (!status?.conditions || status.conditions.length === 0) {
    return PyTorchJobState.PENDING;
  }

  const { conditions } = status;

  // Check for terminal conditions first
  const succeededCondition = conditions.find((condition) => condition.type === 'Succeeded');
  if (succeededCondition?.status === 'True') {
    return PyTorchJobState.SUCCEEDED;
  }

  const failedCondition = conditions.find((condition) => condition.type === 'Failed');
  if (failedCondition?.status === 'True') {
    return PyTorchJobState.FAILED;
  }

  const restartingCondition = conditions.find((condition) => condition.type === 'Restarting');
  if (restartingCondition?.status === 'True') {
    return PyTorchJobState.RESTARTING;
  }

  const runningCondition = conditions.find((condition) => condition.type === 'Running');
  if (runningCondition?.status === 'True') {
    return PyTorchJobState.RUNNING;
  }

  const createdCondition = conditions.find((condition) => condition.type === 'Created');
  if (createdCondition?.status === 'True') {
    return PyTorchJobState.CREATED;
  }

  return PyTorchJobState.UNKNOWN;
};

export const getPyTorchJobStatusColor = (
  state: PyTorchJobState,
): 'green' | 'red' | 'blue' | 'orange' | 'purple' | 'grey' => {
  switch (state) {
    case PyTorchJobState.SUCCEEDED:
      return 'green';
    case PyTorchJobState.FAILED:
      return 'red';
    case PyTorchJobState.RUNNING:
      return 'blue';
    case PyTorchJobState.PENDING:
    case PyTorchJobState.CREATED:
      return 'orange';
    case PyTorchJobState.RESTARTING:
      return 'purple';
    case PyTorchJobState.UNKNOWN:
    default:
      return 'grey';
  }
};
