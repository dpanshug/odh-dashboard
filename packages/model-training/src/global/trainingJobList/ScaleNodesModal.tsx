import * as React from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Alert,
  AlertVariant,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { getDisplayNameFromK8sResource } from '@odh-dashboard/internal/concepts/k8s/utils';
import DashboardModalFooter from '@odh-dashboard/internal/concepts/dashboard/DashboardModalFooter';
import NumberInputWrapper from '@odh-dashboard/internal/components/NumberInputWrapper';
import { TrainJobKind } from '../../k8sTypes';

type ScaleNodesModalProps = {
  job?: TrainJobKind;
  currentNodeCount: number;
  isPaused: boolean;
  isScaling: boolean;
  onClose: () => void;
  onConfirm: (newNodeCount: number) => void;
};

const ScaleNodesModal: React.FC<ScaleNodesModalProps> = ({
  job,
  currentNodeCount,
  isPaused,
  isScaling,
  onClose,
  onConfirm,
}) => {
  const [nodeCount, setNodeCount] = React.useState<number>(currentNodeCount);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    setNodeCount(currentNodeCount);
    setError('');
  }, [currentNodeCount, job]);

  if (!job) {
    return null;
  }

  const displayName = getDisplayNameFromK8sResource(job);
  const isValid = nodeCount > 0 && nodeCount !== currentNodeCount;

  const handleSubmit = () => {
    if (!isValid) {
      setError('Please enter a valid number of nodes different from the current value.');
      return;
    }
    onConfirm(nodeCount);
  };

  return (
    <Modal variant={ModalVariant.small} isOpen onClose={onClose} data-testid="scale-nodes-modal">
      <ModalHeader title="Scale training job nodes" titleIconVariant="info" />
      <ModalBody>
        <p>
          Scale the number of nodes for training job <strong>&quot;{displayName}&quot;</strong>.
        </p>
        <br />
        <FormGroup label="Number of nodes" fieldId="node-count" isRequired>
          <NumberInputWrapper
            inputProps={{
              id: 'node-count',
              'data-testid': 'node-count-input',
            }}
            inputName="node-count"
            value={nodeCount}
            min={1}
            onChange={(value) => {
              setNodeCount(value ?? 1);
              setError('');
            }}
            validated={error ? 'error' : 'default'}
            fullWidth
          />
          {error && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                  {error}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
        <br />
        {isPaused && (
          <Alert
            variant={AlertVariant.info}
            isInline
            title="Job is currently paused"
            data-testid="paused-job-alert"
          >
            The job will remain paused after scaling. Resume the job separately when ready.
          </Alert>
        )}
        {!isPaused && (
          <Alert
            variant={AlertVariant.warning}
            isInline
            title="Job will be updated"
            data-testid="running-job-alert"
          >
            Scaling nodes on a running job may cause a brief interruption as the job adjusts to the
            new configuration.
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <DashboardModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Scale nodes"
          submitButtonVariant="primary"
          isSubmitLoading={isScaling}
          isSubmitDisabled={isScaling || !isValid}
          isCancelDisabled={isScaling}
        />
      </ModalFooter>
    </Modal>
  );
};

export default ScaleNodesModal;
