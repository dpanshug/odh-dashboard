import * as React from 'react';
import { TextArea } from '@patternfly/react-core';
import { TextField } from '~/concepts/connectionTypes/types';
import { FieldProps } from '~/concepts/connectionTypes/fields/types';
import DefaultValueTextRenderer from '~/concepts/connectionTypes/fields/DefaultValueTextRenderer';

const TextFormField: React.FC<FieldProps<TextField>> = ({
  id,
  field,
  mode,
  onChange,
  value,
  'data-testid': dataTestId,
}) => {
  const isPreview = mode === 'preview';
  return (
    <DefaultValueTextRenderer id={id} field={field} mode={mode} component="pre">
      <TextArea
        aria-readonly={isPreview}
        autoComplete="off"
        isRequired={field.required}
        id={id}
        name={id}
        data-testid={dataTestId}
        resizeOrientation="vertical"
        value={(isPreview ? field.properties.defaultValue : value) ?? ''}
        onChange={isPreview || !onChange ? undefined : (_e, v) => onChange(v)}
      />
    </DefaultValueTextRenderer>
  );
};

export default TextFormField;
