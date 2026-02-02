import React from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  HelperText,
  HelperTextItem,
  LabelGroup,
  Popover,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { getDescriptionFromK8sResource } from '#~/concepts/k8s/utils';
import { K8sNameDescriptionFieldData } from '#~/concepts/k8s/K8sNameDescriptionField/types';

import { ConnectionTypeConfigMapObj } from './types';
import UnspecifiedValue from './fields/UnspecifiedValue';
import CategoryLabel from './CategoryLabel';

type Props = {
  connectionType?: ConnectionTypeConfigMapObj;
  isPreview: boolean;
  connectionNameDesc?: K8sNameDescriptionFieldData;
};
export const ConnectionTypeDetailsHelperText: React.FC<Props> = ({
  connectionType,
  isPreview,
  connectionNameDesc,
}) => {
  const displayName = isPreview
    ? connectionType && connectionType.metadata.annotations?.['openshift.io/display-name']
    : connectionNameDesc?.name;
  const description = connectionType && getDescriptionFromK8sResource(connectionType);

  const connectionName = connectionNameDesc?.name;
  const connectionDescription = connectionNameDesc?.description;

  return (
    <HelperText>
      <HelperTextItem>
        <Popover
          headerContent="Connection type details"
          bodyContent={
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Connection type name</DescriptionListTerm>
                <DescriptionListDescription>
                  {displayName || <UnspecifiedValue />}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Connection Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {connectionName || <UnspecifiedValue />}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Connection Description</DescriptionListTerm>
                <DescriptionListDescription>
                  {connectionDescription || <UnspecifiedValue />}
                </DescriptionListDescription>
              </DescriptionListGroup>
              {description ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Connection type description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {description || <UnspecifiedValue />}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : undefined}
              <DescriptionListGroup>
                <DescriptionListTerm>Category</DescriptionListTerm>
                <DescriptionListDescription>
                  {connectionType && connectionType.data?.category?.length ? (
                    <LabelGroup>
                      {connectionType.data.category.map((category) => (
                        <CategoryLabel key={category} category={category} />
                      ))}
                    </LabelGroup>
                  ) : isPreview ? (
                    <UnspecifiedValue />
                  ) : (
                    '-'
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          }
        >
          <Button variant="link" icon={<InfoCircleIcon />} isDisabled={!connectionType}>
            View details
          </Button>
        </Popover>
      </HelperTextItem>
    </HelperText>
  );
};
