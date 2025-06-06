import * as React from 'react';
import { InputGroup, SearchInput, InputGroupItem } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import SimpleSelect, { SimpleSelectOption } from '#~/components/SimpleSelect';
import { asEnumMember } from '#~/utilities/utils';

// List all the possible search fields here
export enum SearchType {
  NAME = 'Name',
  DESCRIPTION = 'Description',
  USER = 'User',
  PROJECT = 'Project',
  METRIC = 'Metric',
  PROTECTED_ATTRIBUTE = 'Protected attribute',
  PRIVILEGED_VALUE = 'Privileged value',
  UNPRIVILEGED_VALUE = 'Unprivileged value',
  OUTPUT = 'Output',
  OUTPUT_VALUE = 'Output value',
  PROVIDER = 'Provider',
  IDENTIFIER = 'Identifier',
  KEYWORD = 'Keyword',
  AUTHOR = 'Author',
  OWNER = 'Owner',
}

type DashboardSearchFieldProps = {
  types: SearchType[];
  searchType: SearchType;
  onSearchTypeChange: (searchType: SearchType) => void;
  searchValue: string;
  onSearchValueChange: (searchValue: string) => void;
  icon?: React.ReactNode;
};

const DashboardSearchField: React.FC<DashboardSearchFieldProps> = ({
  types,
  searchValue,
  searchType,
  onSearchValueChange,
  onSearchTypeChange,
  icon = <FilterIcon />,
}) => (
  <InputGroup data-testid="dashboard-table-toolbar">
    <InputGroupItem>
      <SimpleSelect
        aria-label="Filter type"
        dataTestId="filter-dropdown-select"
        options={types.map(
          (key): SimpleSelectOption => ({
            key,
            label: key,
          }),
        )}
        value={searchType}
        onChange={(key) => {
          const enumMember = asEnumMember(key, SearchType);
          if (enumMember !== null) {
            onSearchTypeChange(enumMember);
          }
        }}
        icon={icon}
        popperProps={{ appendTo: 'inline' }}
      />
    </InputGroupItem>
    <InputGroupItem>
      <SearchInput
        placeholder={`Find by ${searchType.toLowerCase()}`}
        value={searchValue}
        onChange={(_, newSearch) => {
          onSearchValueChange(newSearch);
        }}
        onClear={() => onSearchValueChange('')}
        style={{ minWidth: '200px' }}
      />
    </InputGroupItem>
  </InputGroup>
);

export default DashboardSearchField;
