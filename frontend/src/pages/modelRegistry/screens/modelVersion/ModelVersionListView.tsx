import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { EllipsisVIcon, FilterIcon } from '@patternfly/react-icons';
import { SearchType } from '~/concepts/dashboard/DashboardSearchField';
import { ModelVersion } from '~/concepts/modelRegistry/types';
import SimpleDropdownSelect from '~/components/SimpleDropdownSelect';
import ModelVersionTable from './ModelVersionTable';

type ModelVersionListViewProps = {
  modelVersions: ModelVersion[];
};

const ModelVersionListView: React.FC<ModelVersionListViewProps> = ({
  modelVersions: unfilteredModelVersions,
}) => {
  const [searchType, setSearchType] = React.useState<SearchType>(SearchType.KEYWORD);
  const [search, setSearch] = React.useState('');

  const [isArchivedModelKebabOpen, setIsArchivedModelKebabOpen] = React.useState(false);

  const filteredModelVersions = unfilteredModelVersions.filter((rm) => {
    if (!search) {
      return true;
    }

    switch (searchType) {
      case SearchType.KEYWORD:
        return (
          rm.name.toLowerCase().includes(search.toLowerCase()) ||
          (rm.description && rm.description.toLowerCase().includes(search.toLowerCase()))
        );

      case SearchType.OWNER:
        return rm.author && rm.author.toLowerCase().includes(search.toLowerCase());

      default:
        return true;
    }
  });

  const resetFilters = () => {
    setSearch('');
  };

  const searchTypes = React.useMemo(() => [SearchType.KEYWORD, SearchType.OWNER], []);

  const toggleGroupItems = (
    <ToolbarGroup variant="filter-group">
      <ToolbarFilter
        chips={search === '' ? [] : [search]}
        deleteChip={() => setSearch('')}
        deleteChipGroup={() => setSearch('')}
        categoryName="Keyword"
      >
        <SimpleDropdownSelect
          options={searchTypes.map((key) => ({
            key,
            label: key,
          }))}
          value={searchType}
          onChange={(newSearchType) => {
            setSearchType(newSearchType as SearchType);
          }}
          icon={<FilterIcon />}
        />
      </ToolbarFilter>
      <ToolbarItem variant="search-filter">
        <SearchInput
          placeholder={`Find by ${searchType.toLowerCase()}`}
          value={search}
          onChange={(_, searchValue) => {
            setSearch(searchValue);
          }}
          onClear={() => setSearch('')}
          style={{ minWidth: '200px' }}
        />
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <ModelVersionTable
      clearFilters={resetFilters}
      modelVersions={filteredModelVersions}
      toolbarContent={
        <>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
            {toggleGroupItems}
          </ToolbarToggleGroup>
          <ToolbarItem>
            <Dropdown
              isOpen={isArchivedModelKebabOpen}
              onSelect={() => setIsArchivedModelKebabOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsArchivedModelKebabOpen(isOpen)}
              toggle={(tr: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={tr}
                  variant="plain"
                  onClick={() => setIsArchivedModelKebabOpen(!isArchivedModelKebabOpen)}
                  isExpanded={isArchivedModelKebabOpen}
                >
                  <EllipsisVIcon />
                </MenuToggle>
              )}
              shouldFocusToggleOnSelect
            >
              <DropdownList>
                <DropdownItem isDisabled>View archived models</DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
        </>
      }
    />
  );
};

export default ModelVersionListView;
