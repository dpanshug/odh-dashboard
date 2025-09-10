import React from 'react';
import { FeatureView } from '../../../types/featureView';
import FeatureStoreLineageComponent from '../../lineage/FeatureStoreLineageComponent';

interface FeatureViewLineageProps {
  featureView: FeatureView;
}

const FeatureViewLineage: React.FC<FeatureViewLineageProps> = ({ featureView }) => {
  return (
    <FeatureStoreLineageComponent
      project={featureView.project}
      featureViewName={featureView.spec.name}
      height="400px" // Set a reasonable height for the details view
    />
  );
};

export default FeatureViewLineage;
