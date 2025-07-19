import * as React from 'react';
import DeleteModal from '#~/pages/projects/components/DeleteModal';
import { PyTorchJobKind } from '#~/k8sTypes';
import { deletePyTorchJob } from '#~/api';
import { getDisplayNameFromK8sResource } from '#~/concepts/k8s/utils';

type DeletePyTorchJobModalProps = {
  pytorchJob: PyTorchJobKind;
  onClose: (deleted: boolean) => void;
};

const DeletePyTorchJobModal: React.FC<DeletePyTorchJobModalProps> = ({ pytorchJob, onClose }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();

  const onBeforeClose = (deleted: boolean) => {
    onClose(deleted);
    setIsDeleting(false);
    setError(undefined);
  };

  const deleteName = getDisplayNameFromK8sResource(pytorchJob);

  return (
    <DeleteModal
      title="Delete PyTorch job?"
      onClose={() => onBeforeClose(false)}
      submitButtonLabel="Delete PyTorch job"
      onDelete={() => {
        setIsDeleting(true);
        deletePyTorchJob(pytorchJob.metadata.name, pytorchJob.metadata.namespace)
          .then(() => {
            onBeforeClose(true);
          })
          .catch((e) => {
            setError(e);
            setIsDeleting(false);
          });
      }}
      deleting={isDeleting}
      error={error}
      deleteName={deleteName}
    >
      The PyTorch job <strong>{deleteName}</strong> and its resources will be deleted and all
      information will be lost. This action cannot be undone.
    </DeleteModal>
  );
};

export default DeletePyTorchJobModal;
