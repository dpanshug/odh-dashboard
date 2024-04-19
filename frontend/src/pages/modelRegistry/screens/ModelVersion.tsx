import React from 'react';
import ApplicationsPage from '~/pages/ApplicationsPage';
import { ProjectObjectType } from '~/concepts/design/utils';
import TitleWithIcon from '~/concepts/design/TitleWithIcon';
import useModelVersionsByRegisteredModel from '~/concepts/modelRegistry/apiHooks/useModelVersionsByRegisteredModel';
import ModelVersionListView from './modelVersion/ModelVersionListView';

const ModelVersion: React.FC = () => {
  const [modelVersions, loaded, loadError] = useModelVersionsByRegisteredModel('19');

  return (
    <ApplicationsPage
      empty={modelVersions.items.length === 0}
      title={
        <TitleWithIcon title="Model version" objectType={ProjectObjectType.registeredModels} />
      }
      description="View and manage your model version."
      loadError={loadError}
      loaded={loaded}
      provideChildrenPadding
    >
      <ModelVersionListView modelVersions={modelVersions.items} />
    </ApplicationsPage>
  );
};

export default ModelVersion;
