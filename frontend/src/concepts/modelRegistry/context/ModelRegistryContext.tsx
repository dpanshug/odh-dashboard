import * as React from 'react';
import { SupportedArea, conditionalArea } from '~/concepts/areas';
import { ProjectsContext, byName } from '~/concepts/projects/ProjectsContext';
import useSyncPreferredProject from '~/concepts/projects/useSyncPreferredProject';

type ModelRegistryContextType = {
  registeredModels: any;
  deployedModels: any;
};

const modelRegistryContext = React.createContext<ModelRegistryContextType>({
  registeredModels: {},
  deployedModels: {},
});

type ModelRegistryContextProviderProps = {
  children: React.ReactNode;
  namespace: string;
};

export const ModelRegistryProvider = conditionalArea<ModelRegistryContextProviderProps>(
  SupportedArea.MODEL_REGISTRY,
  true,
)(({ children, namespace }) => {
  const { projects } = React.useContext(ProjectsContext);
  const project = projects.find(byName(namespace)) ?? null;
  useSyncPreferredProject(project);

  const [registeredModels, setRegisteredModels] = React.useState({});
  const [deployedModels, setDeployedModels] = React.useState({});

  return (
    <modelRegistryContext.Provider value={{ registeredModels, deployedModels }}>
      {children}
    </modelRegistryContext.Provider>
  );
});
