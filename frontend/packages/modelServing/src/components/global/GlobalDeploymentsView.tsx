import React from 'react';
import ApplicationsPage from '@odh-dashboard/internal/pages/ApplicationsPage';
import { ProjectObjectType } from '@odh-dashboard/internal/concepts/design/utils';
import TitleWithIcon from '@odh-dashboard/internal/concepts/design/TitleWithIcon';
import type { ProjectKind } from '@odh-dashboard/internal/k8sTypes';
import ModelServingLoading from '@odh-dashboard/internal/pages/modelServing/screens/global/ModelServingLoading';
import { useNavigate } from 'react-router-dom';
import { ProjectsContext } from '@odh-dashboard/internal/concepts/projects/ProjectsContext';
import { GlobalNoModelsView } from './GlobalNoModelsView';
import GlobalDeploymentsTable from './GlobalDeploymentsTable';
import ModelServingProjectSelection from './ModelServingProjectSelection';
import NoProjectsPage from './NoProjectsPage';
import { ModelDeploymentsContext } from '../../concepts/ModelDeploymentsContext';

type GlobalDeploymentsViewProps = {
  projects: ProjectKind[];
};

const GlobalDeploymentsView: React.FC<GlobalDeploymentsViewProps> = ({ projects }) => {
  const { preferredProject } = React.useContext(ProjectsContext);
  const navigate = useNavigate();

  const { deployments, loaded: deploymentsLoaded } = React.useContext(ModelDeploymentsContext);
  const hasDeployments = deployments && deployments.length > 0;
  const isLoading = !deploymentsLoaded;
  const isEmpty = projects.length === 0 || (!isLoading && !hasDeployments);

  return (
    <ApplicationsPage
      loaded={!isLoading}
      loadingContent={
        <ModelServingLoading
          title="Loading"
          description="Retrieving model data from all projects in the cluster. This can take a few minutes."
          onCancel={() => {
            const redirectProject =
              preferredProject ?? projects.length > 0 ? projects[0] : undefined;
            if (redirectProject) {
              navigate(`/modelServing/${redirectProject.metadata.name}`);
            }
          }}
        />
      }
      empty={isEmpty}
      emptyStatePage={
        projects.length === 0 ? (
          <NoProjectsPage />
        ) : (
          <GlobalNoModelsView project={preferredProject ?? undefined} />
        )
      }
      description="Manage and view the health and performance of your deployed models."
      title={
        <TitleWithIcon title="Model deployments" objectType={ProjectObjectType.deployedModels} />
      }
      headerContent={
        <ModelServingProjectSelection getRedirectPath={(ns: string) => `/modelServing/${ns}`} />
      }
      provideChildrenPadding
    >
      <GlobalDeploymentsTable deployments={deployments ?? []} loaded />
    </ApplicationsPage>
  );
};

export default GlobalDeploymentsView;
