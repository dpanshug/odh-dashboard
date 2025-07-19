import * as React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import ApplicationsPage from '#~/pages/ApplicationsPage';
import { byName, ProjectsContext } from '#~/concepts/projects/ProjectsContext';
import InvalidProject from '#~/concepts/projects/InvalidProject';
import PyTorchJobProjectSelector from '#~/pages/pytorchJobs/components/PyTorchJobProjectSelector';
import { PyTorchJobContextProvider } from './PyTorchJobContext';

type ApplicationPageRenderState = {
  empty: boolean;
  emptyStatePage?: React.ReactNode;
};

type PyTorchJobCoreLoaderProps = {
  getInvalidRedirectPath: (namespace: string) => string;
};

const PyTorchJobCoreLoader: React.FC<PyTorchJobCoreLoaderProps> = ({ getInvalidRedirectPath }) => {
  const { namespace } = useParams<{ namespace: string }>();
  const { projects, preferredProject } = React.useContext(ProjectsContext);

  let renderStateProps: ApplicationPageRenderState & { children?: React.ReactNode };
  if (projects.length === 0) {
    renderStateProps = {
      empty: true,
      emptyStatePage: <div>No projects available. Create a project to view PyTorch jobs.</div>,
    };
  } else if (namespace) {
    const foundProject = projects.find(byName(namespace));
    if (foundProject) {
      // Render the content
      return (
        <PyTorchJobContextProvider namespace={namespace}>
          <Outlet />
        </PyTorchJobContextProvider>
      );
    }

    // They ended up on a non-valid project path
    renderStateProps = {
      empty: true,
      emptyStatePage: (
        <InvalidProject namespace={namespace} getRedirectPath={getInvalidRedirectPath} />
      ),
    };
  } else {
    // Redirect the namespace suffix into the URL
    if (preferredProject) {
      return <Navigate to={getInvalidRedirectPath(preferredProject.metadata.name)} replace />;
    }
    // Go with All projects path
    return (
      <PyTorchJobContextProvider>
        <Outlet />
      </PyTorchJobContextProvider>
    );
  }

  return (
    <ApplicationsPage
      {...renderStateProps}
      title="PyTorch jobs"
      description="View and manage PyTorch distributed training jobs in your projects."
      loaded
      headerContent={<PyTorchJobProjectSelector getRedirectPath={getInvalidRedirectPath} />}
      provideChildrenPadding
    />
  );
};

export default PyTorchJobCoreLoader;
