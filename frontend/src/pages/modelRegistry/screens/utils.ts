import { ModelRegistryCustomProperties } from '~/concepts/modelRegistry/types';

//Retrieves the labels from customProperties that have non-empty string_value.
export const getModelLabels = (customProperties: ModelRegistryCustomProperties): string[] =>
  Object.keys(customProperties).filter((key) => customProperties[key].string_value === '');
