import * as React from 'react';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { Text, TextVariants, Truncate } from '@patternfly/react-core';
import { RegisteredModel } from '~/concepts/modelRegistry/types';
import RegisteredModelOwner from './RegisteredModelOwner';
import TableLabelsRow from './components/TableLabelsRow';
import TableLastModifiedRow from './components/TableLastModifiedRow';

type RegisteredModelTableRowProps = {
  registeredModel: RegisteredModel;
};

const RegisteredModelTableRow: React.FC<RegisteredModelTableRowProps> = ({
  registeredModel: rm,
}) => (
  <Tr>
    <Td dataLabel="Model name">
      <div id="model-name" data-testid="model-name">
        <Truncate content={rm.name} />
      </div>
      {rm.description && (
        <Text data-testid="description" component={TextVariants.small}>
          <Truncate content={rm.description} />
        </Text>
      )}
    </Td>
    <Td dataLabel="Labels">
      <TableLabelsRow customProperties={rm.customProperties} name={rm.name} />
    </Td>
    <Td dataLabel="Last modified">
      <TableLastModifiedRow lastUpdateTimeSinceEpoch={rm.lastUpdateTimeSinceEpoch} />
    </Td>
    <Td dataLabel="Owner">
      <RegisteredModelOwner registeredModelId={rm.id} />
    </Td>
    <Td isActionCell>
      <ActionsColumn
        items={[
          {
            title: 'View details',
            // TODO: Implement functionality for onClick. This will be added in another PR
            onClick: () => undefined,
          },
          {
            title: 'Archive model',
            isDisabled: true, // This feature is currently disabled but will be enabled in a future PR post-summit release.
          },
        ]}
      />
    </Td>
  </Tr>
);

export default RegisteredModelTableRow;
