import * as React from 'react';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { Timestamp } from '@patternfly/react-core';
import { PyTorchJobKind } from '#~/k8sTypes';
import { getDisplayNameFromK8sResource } from '#~/concepts/k8s/utils';
import PyTorchJobStatus from './pytorchJobStatus/PyTorchJobStatus';

type PyTorchJobTableRowType = {
  pytorchJob: PyTorchJobKind;
  onDeletePyTorchJob: (pytorchJob: PyTorchJobKind) => void;
};

const PyTorchJobTableRow: React.FC<PyTorchJobTableRowType> = ({
  pytorchJob,
  onDeletePyTorchJob,
}) => (
  <Tr>
    <Td dataLabel="Name">{getDisplayNameFromK8sResource(pytorchJob)}</Td>
    <Td dataLabel="Namespace">{pytorchJob.metadata.namespace}</Td>
    <Td dataLabel="Age">
      {pytorchJob.metadata.creationTimestamp ? (
        <Timestamp date={new Date(pytorchJob.metadata.creationTimestamp)} />
      ) : (
        'Unknown'
      )}
    </Td>
    <Td dataLabel="Status">
      <PyTorchJobStatus pytorchJob={pytorchJob} />
    </Td>
    <Td isActionCell>
      <ActionsColumn
        items={[
          {
            title: 'Delete',
            itemKey: 'pytorch-job-delete',
            onClick: () => onDeletePyTorchJob(pytorchJob),
          },
        ]}
      />
    </Td>
  </Tr>
);

export default PyTorchJobTableRow;
