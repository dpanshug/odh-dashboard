import * as React from 'react';
import { Icon, Popover, Button } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { LMEvalKind } from '#~/k8sTypes';
import { LMEvalState } from '#~/pages/lmEval/types';

type LMEvalStatusProps = {
  status: LMEvalKind['status'];
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
};

export const getLMEvalStatusMessage = (status: LMEvalKind['status']): string => {
  if (!status?.state) {
    return 'Unknown';
  }

  if (status.state === 'Complete' && status.reason === 'Failed') {
    return status.message || 'Failed';
  }

  switch (status.state) {
    case 'Scheduled':
      return 'Pending';
    case 'Running':
      return 'Running';
    case 'Complete':
      return status.reason === 'NoReason' ? 'Complete' : status.reason || 'Complete';
    default:
      return status.state;
  }
};

export const getLMEvalState = (status: LMEvalKind['status']): LMEvalState => {
  if (!status?.state) {
    return LMEvalState.PENDING;
  }

  switch (status.state) {
    case 'Scheduled':
      return LMEvalState.PENDING;
    case 'Running':
      return LMEvalState.RUNNING;
    case 'Complete':
      return status.reason === 'Failed' ? LMEvalState.FAILED : LMEvalState.COMPLETE;
    default:
      return LMEvalState.PENDING;
  }
};

const LMEvalStatus: React.FC<LMEvalStatusProps> = ({ status, iconSize = 'sm' }) => {
  const currentState = getLMEvalState(status);
  const statusMessage = getLMEvalStatusMessage(status);

  const statusIcon = () => {
    switch (currentState) {
      case LMEvalState.COMPLETE:
        return (
          <Button
            variant="link"
            isInline
            data-testid="status-tooltip"
            icon={
              <Icon status="success" isInline iconSize={iconSize}>
                <CheckCircleIcon />
              </Icon>
            }
          />
        );
      case LMEvalState.FAILED:
        return (
          <Button
            variant="link"
            isInline
            data-testid="status-tooltip"
            icon={
              <Icon status="danger" isInline iconSize={iconSize}>
                <ExclamationCircleIcon />
              </Icon>
            }
          />
        );
      case LMEvalState.PENDING:
      case LMEvalState.RUNNING:
        return (
          <Icon isInline iconSize={iconSize}>
            <InProgressIcon />
          </Icon>
        );
      default:
        return (
          <Button
            variant="link"
            isInline
            data-testid="status-tooltip"
            icon={
              <Icon status="warning" isInline iconSize={iconSize}>
                <OutlinedQuestionCircleIcon />
              </Icon>
            }
          />
        );
    }
  };

  const headerContent = () => {
    switch (currentState) {
      case LMEvalState.COMPLETE:
        return 'Evaluation Complete';
      case LMEvalState.FAILED:
        return 'Evaluation Failed';
      case LMEvalState.PENDING:
        return 'Evaluation Pending';
      case LMEvalState.RUNNING:
        return 'Evaluation Running';
      default:
        return 'Evaluation Status';
    }
  };

  const bodyContent = () => {
    if (currentState === LMEvalState.FAILED) {
      return status?.reason || status?.message || 'Unknown';
    }
    return statusMessage;
  };

  return (
    <Popover
      data-testid="lmeval-status-tooltip"
      className="odh-u-scrollable"
      position="top"
      headerContent={headerContent()}
      bodyContent={bodyContent()}
      isVisible={bodyContent() ? undefined : false}
    >
      {statusIcon()}
    </Popover>
  );
};

export default LMEvalStatus;
