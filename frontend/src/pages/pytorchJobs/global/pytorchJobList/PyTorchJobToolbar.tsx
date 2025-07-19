import * as React from 'react';
import { SearchInput } from '@patternfly/react-core';
import FilterToolbar from '#~/components/FilterToolbar';
import {
  PyTorchJobFilterOptions,
  PyTorchJobToolbarFilterOptions,
  PyTorchJobFilterDataType,
} from './const';

type PyTorchJobToolbarProps = {
  filterData: PyTorchJobFilterDataType;
  onFilterUpdate: (
    key: string,
    value: string | { label: string; value: string } | undefined,
  ) => void;
};

const PyTorchJobToolbar: React.FC<PyTorchJobToolbarProps> = ({ filterData, onFilterUpdate }) => (
  <FilterToolbar<keyof typeof PyTorchJobFilterOptions>
    data-testid="pytorch-job-table-toolbar"
    filterOptions={PyTorchJobFilterOptions}
    filterOptionRenders={{
      [PyTorchJobToolbarFilterOptions.name]: ({ onChange, ...props }) => (
        <SearchInput
          {...props}
          aria-label="Filter by name"
          placeholder="Filter by name"
          onChange={(_event, value) => onChange(value)}
        />
      ),
      [PyTorchJobToolbarFilterOptions.namespace]: ({ onChange, ...props }) => (
        <SearchInput
          {...props}
          aria-label="Filter by namespace"
          placeholder="Filter by namespace"
          onChange={(_event, value) => onChange(value)}
        />
      ),
    }}
    filterData={filterData}
    onFilterUpdate={onFilterUpdate}
  />
);

export default PyTorchJobToolbar;
