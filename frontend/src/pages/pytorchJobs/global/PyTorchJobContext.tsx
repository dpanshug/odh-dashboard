import * as React from 'react';
import { PyTorchJobKind, ProjectKind } from '#~/k8sTypes';
import { DEFAULT_LIST_WATCH_RESULT } from '#~/utilities/const';
import { SupportedArea, conditionalArea } from '#~/concepts/areas';
import { ProjectsContext, byName } from '#~/concepts/projects/ProjectsContext';
import { usePyTorchJobs } from '#~/api/index.ts';
import { CustomWatchK8sResult } from '#~/types.ts';

type PyTorchJobContextType = {
  pytorchJobs: CustomWatchK8sResult<PyTorchJobKind[]>;
  project?: ProjectKind | null;
  preferredProject?: ProjectKind | null;
  projects?: ProjectKind[] | null;
};

export const PyTorchJobContext = React.createContext<PyTorchJobContextType>({
  pytorchJobs: DEFAULT_LIST_WATCH_RESULT,
});

type PyTorchJobContextProviderProps = {
  children: React.ReactNode;
  namespace?: string;
};

export const PyTorchJobContextProvider = conditionalArea<PyTorchJobContextProviderProps>(
  SupportedArea.TRAINING_OPERATOR,
  true,
)(({ children, namespace }) => {
  const { projects, preferredProject } = React.useContext(ProjectsContext);
  const project = projects.find(byName(namespace)) ?? null;

  const pytorchJobs = usePyTorchJobs(namespace ?? '');

  return (
    <PyTorchJobContext.Provider
      value={{
        pytorchJobs,
        project,
        preferredProject,
        projects,
      }}
    >
      {children}
    </PyTorchJobContext.Provider>
  );
});
