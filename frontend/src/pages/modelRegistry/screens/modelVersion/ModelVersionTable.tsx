import * as React from 'react';
import { Table } from '~/components/table';
import { ModelVersion } from '~/concepts/modelRegistry/types';
import DashboardEmptyTableView from '~/concepts/dashboard/DashboardEmptyTableView';
import { columns } from './const';
import ModelVersionTableRow from './ModelVersionTableRow';

type ModelVersionTableProps = {
  clearFilters: () => void;
  modelVersions: ModelVersion[];
} & Partial<Pick<React.ComponentProps<typeof Table>, 'toolbarContent'>>;

const ModelVersionTable: React.FC<ModelVersionTableProps> = ({
  clearFilters,
  modelVersions,
  toolbarContent,
}) => (
  <Table
    data-testid="model-version-table"
    data={modelVersions}
    columns={columns}
    toolbarContent={toolbarContent}
    enablePagination
    emptyTableView={<DashboardEmptyTableView onClearFilters={clearFilters} />}
    rowRenderer={(rm) => <ModelVersionTableRow key={rm.name} modelVersion={rm} />}
  />
);

export default ModelVersionTable;
