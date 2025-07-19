import * as React from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProjectsRoutes from '#~/concepts/projects/ProjectsRoutes';
import PyTorchJobCoreLoader from './global/PyTorchJobCoreLoader';
import PyTorchJobs from './global/PyTorchJobs';

const PyTorchJobRoutes: React.FC = () => (
  <ProjectsRoutes>
    <Route
      path="/:namespace?/*"
      element={
        <PyTorchJobCoreLoader getInvalidRedirectPath={(namespace) => `/jobs/${namespace}`} />
      }
    >
      <Route index element={<PyTorchJobs />} />
      <Route path="*" element={<Navigate to="." />} />
    </Route>
  </ProjectsRoutes>
);

export default PyTorchJobRoutes;
