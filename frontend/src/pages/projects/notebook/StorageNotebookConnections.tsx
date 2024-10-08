import * as React from 'react';
import { Alert } from '@patternfly/react-core';
import { ForNotebookSelection } from '~/pages/projects/types';
import MountPathField from '~/pages/projects/pvc/MountPathField';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { NotebookKind } from '~/k8sTypes';
import { getNotebookMountPaths } from './utils';
import ConnectedNotebookField from './ConnectedNotebookField';

type StorageNotebookConnectionsProps = {
  forNotebookData: ForNotebookSelection;
  setForNotebookData: (value: ForNotebookSelection) => void;
  connectedNotebooks: NotebookKind[];
};

const StorageNotebookConnections: React.FC<StorageNotebookConnectionsProps> = ({
  forNotebookData,
  setForNotebookData,
  connectedNotebooks,
}) => {
  const {
    notebooks: { data, loaded, error },
  } = React.useContext(ProjectDetailsContext);
  const notebooks = data.map(({ notebook }) => notebook);

  if (error) {
    return (
      <Alert variant="danger" isInline title="Unable to fetch notebooks">
        {error.message}
      </Alert>
    );
  }

  const inUseMountPaths = getNotebookMountPaths(
    notebooks.find((notebook) => notebook.metadata.name === forNotebookData.name),
  );

  const connectedNotebookNames = connectedNotebooks.map((notebook) => notebook.metadata.name);
  const availableNotebooks = notebooks.filter(
    (notebook) => !connectedNotebookNames.includes(notebook.metadata.name),
  );

  return (
    <>
      <ConnectedNotebookField
        isDisabled={availableNotebooks.length === 0}
        loaded={loaded}
        notebooks={availableNotebooks}
        selections={[forNotebookData.name]}
        onSelect={(selectionItems) => {
          const selection = selectionItems[0];
          if (selection) {
            setForNotebookData({
              name: selection,
              mountPath: { value: '', error: '' },
            });
          } else {
            setForNotebookData({ name: '', mountPath: { value: '', error: '' } });
          }
        }}
      />
      {forNotebookData.name && (
        <MountPathField
          inUseMountPaths={inUseMountPaths}
          mountPath={forNotebookData.mountPath}
          setMountPath={(mountPath) => {
            setForNotebookData({ ...forNotebookData, mountPath });
          }}
        />
      )}
    </>
  );
};

export default StorageNotebookConnections;
