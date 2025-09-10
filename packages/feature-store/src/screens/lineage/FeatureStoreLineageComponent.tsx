import React, { useMemo, useState } from 'react';
import { EmptyStateVariant, EmptyStateBody, EmptyState, PageSection } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { Lineage } from '@odh-dashboard/internal/components/lineage/Lineage';
import { createLineageComponentFactory } from '@odh-dashboard/internal/components/lineage/factories';
import FeatureStoreLineageNode from './node/FeatureStoreLineageNode';
import FeatureStoreLineageNodePopover from './node/FeatureStoreLineageNodePopover';
import { applyLineageFilters } from './utils';
import FeatureStoreLineageToolbar from '../../components/FeatureStoreLineageToolbar';
import useFeatureStoreLineage from '../../apiHooks/useFeatureStoreLineage';
import useFeatureViewLineage from '../../apiHooks/useFeatureViewLineage';
import { convertFeatureStoreLineageToVisualizationData } from '../../utils/lineageDataConverter';
import { FeatureStoreLineageSearchFilters } from '../../types/toolbarTypes';

interface FeatureStoreLineageComponentProps {
  project?: string;
  featureViewName?: string;
  showEmptyStateWhenNoProject?: boolean;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  height?: string;
}

const FeatureStoreLineageComponent: React.FC<FeatureStoreLineageComponentProps> = ({
  project,
  featureViewName,
  showEmptyStateWhenNoProject = false,
  emptyStateTitle = 'Select a feature store repository',
  emptyStateMessage = 'Select a feature store repository to view its lineage.',
  height = '100%',
}) => {
  if (showEmptyStateWhenNoProject && !project) {
    return (
      <EmptyState
        headingLevel="h6"
        icon={PlusCircleIcon}
        titleText={emptyStateTitle}
        variant={EmptyStateVariant.lg}
        data-testid="empty-state-title"
      >
        <EmptyStateBody data-testid="empty-state-body">{emptyStateMessage}</EmptyStateBody>
      </EmptyState>
    );
  }

  const [hideNodesWithoutRelationships, setHideNodesWithoutRelationships] = useState(false);
  const [searchFilters, setSearchFilters] = useState<FeatureStoreLineageSearchFilters>({});
  const [conversionError, setConversionError] = useState<string | null>(null);

  const featureStoreLineageResult = useFeatureStoreLineage(featureViewName ? undefined : project);
  const featureViewLineageResult = useFeatureViewLineage(
    featureViewName ? project : undefined,
    featureViewName,
  );

  const featureStoreData = featureViewName ? undefined : featureStoreLineageResult.data;
  const featureViewData = featureViewName ? featureViewLineageResult.data : undefined;
  const lineageDataLoaded = featureViewName
    ? featureViewLineageResult.loaded
    : featureStoreLineageResult.loaded;
  const error = featureViewName ? featureViewLineageResult.error : featureStoreLineageResult.error;

  const componentFactory = useMemo(
    () => createLineageComponentFactory(FeatureStoreLineageNode),
    [],
  );

  const visualizationData = useMemo(() => {
    setConversionError(null);

    if (!lineageDataLoaded || error) {
      // Return empty data when loading or error - let the Lineage component handle these states
      return { nodes: [], edges: [] };
    }

    // Handle feature view lineage (simpler structure)
    if (featureViewName) {
      // For feature view lineage, we need to convert the relationships to visualization format
      // This might need a different converter function - for now, return empty data
      // TODO: Implement feature view lineage visualization conversion
      return { nodes: [], edges: [] };
    }

    // Handle feature store lineage (comprehensive structure)
    if (featureStoreData && Object.keys(featureStoreData).length > 0) {
      try {
        const baseResult = convertFeatureStoreLineageToVisualizationData(featureStoreData);

        // Apply filters using utility function
        const filteredResult = applyLineageFilters(baseResult, {
          hideNodesWithoutRelationships,
          searchFilters,
        });

        return filteredResult;
      } catch (err) {
        setConversionError(`Failed to process lineage data: ${String(err)}`);
        return { nodes: [], edges: [] };
      }
    }

    // No data available - return empty data for proper empty state
    return { nodes: [], edges: [] };
  }, [
    featureStoreData,
    featureViewData,
    lineageDataLoaded,
    error,
    hideNodesWithoutRelationships,
    searchFilters,
    featureViewName,
  ]);

  const ToolbarComponent = () => (
    <FeatureStoreLineageToolbar
      hideNodesWithoutRelationships={hideNodesWithoutRelationships}
      onHideNodesWithoutRelationshipsChange={setHideNodesWithoutRelationships}
      searchFilters={searchFilters}
      onSearchFiltersChange={setSearchFilters}
      lineageData={featureStoreData}
      lineageDataLoaded={lineageDataLoaded}
    />
  );

  return (
    <PageSection
      hasBodyWrapper={false}
      isFilled
      padding={{ default: 'noPadding' }}
      style={{ height }}
    >
      <Lineage
        data={visualizationData}
        loading={!lineageDataLoaded}
        error={
          error ? `Failed to load lineage data: ${String(error)}` : conversionError || undefined
        }
        emptyStateMessage={
          featureViewName
            ? 'No lineage data available for this feature view'
            : 'No lineage data available for this feature store repository'
        }
        height="100%"
        componentFactory={componentFactory}
        popoverComponent={FeatureStoreLineageNodePopover}
        toolbarComponent={ToolbarComponent}
        autoResetOnDataChange // Auto-reset view when filters are applied
      />
    </PageSection>
  );
};

export default FeatureStoreLineageComponent;
