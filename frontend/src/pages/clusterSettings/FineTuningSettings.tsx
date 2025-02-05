import * as React from 'react';
import { Checkbox, Stack, StackItem } from '@patternfly/react-core';
import SettingSection from '~/components/SettingSection';

type FineTuningSettingsProps = {
  initialValue: boolean;
  enabled: boolean;
  setEnabled: (settings: boolean) => void;
};

const FineTuningSettings: React.FC<FineTuningSettingsProps> = ({
  initialValue,
  enabled,
  setEnabled,
}) => {
  React.useEffect(() => {
    if (initialValue) {
      setEnabled(initialValue);
    }
  }, [initialValue, setEnabled]);

  return (
    <SettingSection title="Instrutlab pipeline">
      <Stack hasGutter>
        <StackItem>
          <Checkbox
            label="Instructlab flow for all Data Science Projects"
            isChecked={enabled}
            onChange={() => {
              setEnabled(!enabled);
            }}
            aria-label="fineTuningEnabledCheckbox"
            id="fine-tuning-enabled-checkbox"
            data-testid="fine-tuning-enabled-checkbox"
            name="fineTuningEnabledCheckbox"
          />
        </StackItem>
      </Stack>
    </SettingSection>
  );
};

export default FineTuningSettings;
