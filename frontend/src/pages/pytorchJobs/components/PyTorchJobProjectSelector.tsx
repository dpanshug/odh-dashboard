import * as React from 'react';
import ProjectSelectorNavigator from '#~/concepts/projects/ProjectSelectorNavigator';

type PyTorchJobProjectSelectorProps = {
  getRedirectPath: (namespace: string) => string;
};

const PyTorchJobProjectSelector: React.FC<PyTorchJobProjectSelectorProps> = ({
  getRedirectPath,
}) => (
  <ProjectSelectorNavigator
    getRedirectPath={getRedirectPath}
    invalidDropdownPlaceholder="All projects"
    selectAllProjects
    showTitle
  />
);

export default PyTorchJobProjectSelector;
