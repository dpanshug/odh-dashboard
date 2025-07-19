import React from 'react';
import {
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyState,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import ApplicationsPage from '#~/pages/ApplicationsPage';
import { ProjectObjectType } from '#~/concepts/design/utils';
import TitleWithIcon from '#~/concepts/design/TitleWithIcon';
import PyTorchJobProjectSelector from '#~/pages/pytorchJobs/components/PyTorchJobProjectSelector';
import { PyTorchJobContext } from './PyTorchJobContext';
import PyTorchJobListView from './pytorchJobList/PyTorchJobListView';

const title = 'PyTorch jobs';
const description =
  'View and manage PyTorch distributed training jobs. PyTorch jobs enable distributed training across multiple workers for deep learning models.';

const PyTorchJobs = (): React.ReactElement => {
  const { pytorchJobs } = React.useContext(PyTorchJobContext);
  const [pytorchJobData, pytorchJobLoaded, pytorchJobLoadError] = pytorchJobs;

  const emptyState = (
    <EmptyState
      headingLevel="h6"
      icon={SearchIcon}
      titleText="No PyTorch jobs"
      variant={EmptyStateVariant.lg}
      data-testid="empty-state-title"
    >
      <EmptyStateBody data-testid="empty-state-body">
        No PyTorch jobs have been created in this project. Create a new PyTorch job to get started
        with distributed training, or select a different project.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>{/* TODO: Add create PyTorch job button here */}</EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );

  return (
    <ApplicationsPage
      empty={pytorchJobData.length === 0}
      emptyStatePage={emptyState}
      title={<TitleWithIcon title={title} objectType={ProjectObjectType.project} />}
      description={description}
      loadError={pytorchJobLoadError}
      loaded={pytorchJobLoaded}
      headerContent={<PyTorchJobProjectSelector getRedirectPath={(ns: string) => `/jobs/${ns}`} />}
      provideChildrenPadding
    >
      <PyTorchJobListView pytorchJobs={pytorchJobData} />
    </ApplicationsPage>
  );
};

export default PyTorchJobs;
