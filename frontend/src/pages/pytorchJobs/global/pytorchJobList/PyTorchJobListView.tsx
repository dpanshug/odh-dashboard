import * as React from 'react';
import { PyTorchJobKind } from '#~/k8sTypes';
import { getDisplayNameFromK8sResource } from '#~/concepts/k8s/utils';
import PyTorchJobTable from './PyTorchJobTable';
import { initialPyTorchJobFilterData, PyTorchJobFilterDataType } from './const';
import PyTorchJobToolbar from './PyTorchJobToolbar';

type PyTorchJobListViewProps = {
  pytorchJobs: PyTorchJobKind[];
};

const PyTorchJobListView: React.FC<PyTorchJobListViewProps> = ({
  pytorchJobs: unfilteredPyTorchJobs,
}) => {
  const [filterData, setFilterData] = React.useState<PyTorchJobFilterDataType>(
    initialPyTorchJobFilterData,
  );

  const onClearFilters = React.useCallback(
    () => setFilterData(initialPyTorchJobFilterData),
    [setFilterData],
  );

  const filteredPyTorchJobs = React.useMemo(
    () =>
      unfilteredPyTorchJobs.filter((pytorchJob) => {
        const nameFilter = filterData.Name?.toLowerCase();
        const namespaceFilter = filterData.Namespace?.toLowerCase();

        if (
          nameFilter &&
          !getDisplayNameFromK8sResource(pytorchJob).toLowerCase().includes(nameFilter)
        ) {
          return false;
        }

        return (
          !namespaceFilter || pytorchJob.metadata.namespace.toLowerCase().includes(namespaceFilter)
        );
      }),
    [filterData, unfilteredPyTorchJobs],
  );

  const onFilterUpdate = React.useCallback(
    (key: string, value: string | { label: string; value: string } | undefined) =>
      setFilterData((prevValues) => ({ ...prevValues, [key]: value })),
    [setFilterData],
  );

  return (
    <PyTorchJobTable
      pytorchJobs={filteredPyTorchJobs}
      onClearFilters={onClearFilters}
      toolbarContent={<PyTorchJobToolbar filterData={filterData} onFilterUpdate={onFilterUpdate} />}
    />
  );
};

export default PyTorchJobListView;
