import * as React from 'react';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { Text, TextVariants, Truncate } from '@patternfly/react-core';
import { ModelVersion } from '~/concepts/modelRegistry/types';
import TableLastModifiedRow from '~/pages/modelRegistry/screens/components/TableLastModifiedRow';
import TableLabelsRow from '~/pages/modelRegistry/screens/components/TableLabelsRow';

type ModelVersionTableRowProps = {
  modelVersion: ModelVersion;
};

const ModelVersionTableRow: React.FC<ModelVersionTableRowProps> = ({ modelVersion: mv }) => (
  <Tr>
    <Td dataLabel="Version name">
      <Truncate content={mv.name} />
      {mv.description && (
        <Text data-testid="description" component={TextVariants.small}>
          <Truncate content={mv.description} />
        </Text>
      )}
    </Td>
    <Td dataLabel="Last modified">
      <TableLastModifiedRow lastUpdateTimeSinceEpoch={mv.lastUpdateTimeSinceEpoch} />
    </Td>
    <Td dataLabel="Owner">
      <Text>{mv.author || '-'}</Text>
    </Td>
    <Td dataLabel="Labels">
      <TableLabelsRow customProperties={mv.customProperties} name={mv.name} />
    </Td>
    <Td isActionCell>
      <ActionsColumn
        items={[
          {
            title: 'Deploy',
            // TODO: Implement functionality for onClick. This will be added in another PR
            onClick: () => undefined,
          },
          {
            title: 'Archive version',
            isDisabled: true, // This feature is currently disabled but will be enabled in a future PR post-summit release.
          },
        ]}
      />
    </Td>
  </Tr>
);

export default ModelVersionTableRow;
