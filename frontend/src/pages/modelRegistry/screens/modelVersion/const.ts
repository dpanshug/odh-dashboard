import { SortableData } from '~/components/table';
import { ModelVersion } from '~/concepts/modelRegistry/types';

export const columns: SortableData<ModelVersion>[] = [
  {
    field: 'version name',
    label: 'Version name',
    sortable: (a, b) => a.name.localeCompare(b.name),
    width: 40,
  },
  {
    field: 'last_modified',
    label: 'Last modified',
    sortable: (a: ModelVersion, b: ModelVersion): number => {
      const first = parseInt(a.lastUpdateTimeSinceEpoch);
      const second = parseInt(b.lastUpdateTimeSinceEpoch);
      return new Date(first).getTime() - new Date(second).getTime();
    },
  },
  {
    field: 'owner',
    label: 'Owner',
    sortable: (a, b) => (a.author || '-').localeCompare(b.author || '-'),
  },
  {
    field: 'labels',
    label: 'Labels',
    sortable: false,
    width: 35,
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
  },
];
