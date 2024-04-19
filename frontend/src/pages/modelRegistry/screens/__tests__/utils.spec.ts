/* eslint-disable camelcase */
import { ModelRegistryCustomProperties } from '~/concepts/modelRegistry/types';
import { getModelLabels } from '~/pages/modelRegistry/screens/utils';

describe('getModelLabels', () => {
  it('should return an empty array when customProperties is empty', () => {
    const customProperties: ModelRegistryCustomProperties = {};
    const result = getModelLabels(customProperties);
    expect(result).toEqual([]);
  });

  it('should return an array of keys with empty string values in customProperties', () => {
    const customProperties: ModelRegistryCustomProperties = {
      label1: { string_value: '' },
      label2: { string_value: 'non-empty' },
      label3: { string_value: '' },
    };
    const result = getModelLabels(customProperties);
    expect(result).toEqual(['label1', 'label3']);
  });

  it('should return an empty array when all values in customProperties are non-empty strings', () => {
    const customProperties: ModelRegistryCustomProperties = {
      label1: { string_value: 'non-empty' },
      label2: { string_value: 'another-non-empty' },
    };
    const result = getModelLabels(customProperties);
    expect(result).toEqual([]);
  });
});
