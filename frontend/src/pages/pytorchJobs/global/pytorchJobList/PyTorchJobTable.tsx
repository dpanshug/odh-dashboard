import * as React from 'react';
import { Table } from '#~/components/table';
import { PyTorchJobKind } from '#~/k8sTypes';
import DashboardEmptyTableView from '#~/concepts/dashboard/DashboardEmptyTableView';
import PyTorchJobTableRow from './PyTorchJobTableRow';
import { columns } from './const';
import DeletePyTorchJobModal from './DeletePyTorchJobModal';

type PyTorchJobTableProps = {
  pytorchJobs: PyTorchJobKind[];
  clearFilters?: () => void;
  onClearFilters: () => void;
} & Partial<Pick<React.ComponentProps<typeof Table>, 'enablePagination' | 'toolbarContent'>>;

const PyTorchJobTable: React.FC<PyTorchJobTableProps> = ({
  pytorchJobs,
  clearFilters,
  onClearFilters,
  toolbarContent,
}) => {
  const [deletePyTorchJob, setDeletePyTorchJob] = React.useState<PyTorchJobKind>();
  return (
    <>
      <Table
        data-testid="pytorch-job-table"
        id="pytorch-job-table"
        enablePagination
        data={pytorchJobs}
        columns={columns}
        onClearFilters={onClearFilters}
        toolbarContent={toolbarContent}
        emptyTableView={
          clearFilters ? <DashboardEmptyTableView onClearFilters={clearFilters} /> : undefined
        }
        rowRenderer={(cr) => (
          <PyTorchJobTableRow
            key={cr.metadata.uid}
            pytorchJob={cr}
            onDeletePyTorchJob={(i) => setDeletePyTorchJob(i)}
          />
        )}
      />

      {deletePyTorchJob ? (
        <DeletePyTorchJobModal
          pytorchJob={deletePyTorchJob}
          onClose={() => {
            setDeletePyTorchJob(undefined);
          }}
        />
      ) : null}
    </>
  );
};

export default PyTorchJobTable;
