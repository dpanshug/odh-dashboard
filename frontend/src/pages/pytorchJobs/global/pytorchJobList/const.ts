import { SortableData } from '#~/components/table';
import { PyTorchJobKind } from '#~/k8sTypes';
import { getPyTorchJobState } from './utils';

export const columns: SortableData<PyTorchJobKind>[] = [
  {
    field: 'name',
    label: 'Name',
    width: 25,
    sortable: (a: PyTorchJobKind, b: PyTorchJobKind): number =>
      a.metadata.name.localeCompare(b.metadata.name),
  },
  {
    field: 'namespace',
    label: 'Namespace',
    width: 20,
    sortable: (a: PyTorchJobKind, b: PyTorchJobKind): number =>
      a.metadata.namespace.localeCompare(b.metadata.namespace),
  },
  {
    field: 'created',
    label: 'Age',
    width: 20,
    sortable: (a: PyTorchJobKind, b: PyTorchJobKind): number => {
      const first = a.metadata.creationTimestamp;
      const second = b.metadata.creationTimestamp;
      return new Date(first ?? 0).getTime() - new Date(second ?? 0).getTime();
    },
  },
  {
    field: 'status',
    label: 'Status',
    width: 25,
    sortable: (a: PyTorchJobKind, b: PyTorchJobKind): number => {
      const aState = getPyTorchJobState(a.status);
      const bState = getPyTorchJobState(b.status);
      return aState.localeCompare(bState);
    },
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
  },
];

export enum PyTorchJobToolbarFilterOptions {
  name = 'Name',
  namespace = 'Namespace',
}

export const PyTorchJobFilterOptions = {
  [PyTorchJobToolbarFilterOptions.name]: PyTorchJobToolbarFilterOptions.name,
  [PyTorchJobToolbarFilterOptions.namespace]: PyTorchJobToolbarFilterOptions.namespace,
};

export type PyTorchJobFilterDataType = Record<PyTorchJobToolbarFilterOptions, string | undefined>;

export const initialPyTorchJobFilterData: PyTorchJobFilterDataType = {
  [PyTorchJobToolbarFilterOptions.name]: '',
  [PyTorchJobToolbarFilterOptions.namespace]: '',
};
