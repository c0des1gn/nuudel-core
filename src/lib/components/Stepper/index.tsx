import React from 'react';
import { Stepper, StepperProps, Step, StepLabel } from '@material-ui/core';
import { t } from 'nuudel-utils';

interface IStepperProps extends StepperProps {
  status: string;
  step?: string;
}

const getSteps = (status: string, step = 'Facility') => {
  let activeStep: number = 0;
  let values: string[] = [];
  switch (status) {
    case 'Pending':
    case 'Created':
    case 'Pickedup':
    case 'Canceled':
    case 'Deleted':
      activeStep = 0;
      values = [status, step, 'InTransit', 'Delivered'];
      break;
    case 'Facility':
    case 'Failed':
      activeStep = 1;
      values = ['Created', status, 'InTransit', 'Delivered'];
      break;
    case 'InTransit':
      activeStep = 2;
      values = ['Created', step, status, 'Delivered'];
      break;
    case 'Returned':
    case 'Delivered':
    case 'Declined':
      activeStep = 3;
      values = ['Created', step, 'InTransit', status];
      break;
    default:
      break;
  }
  return { values, activeStep };
};

const isStepFailed = (status: string) => {
  let failedStatus: boolean = false;
  switch (status) {
    case 'Canceled':
    case 'Failed':
    case 'Declined':
    case 'Returned':
    case 'Deleted':
      failedStatus = true;
      break;
    default:
      break;
  }
  return failedStatus;
};

const Steppers: React.FC<IStepperProps> = ({ children, step, ...props }) => (
  <>
    {children}
    <Stepper
      {...props}
      activeStep={getSteps(props.status, step).activeStep}
      alternativeLabel
      style={{ width: '100%' }}
    >
      {getSteps(props.status, step).values.map((label, index) => {
        const stepProps: { completed?: boolean } = {};
        const labelProps: {
          error?: boolean;
        } = {};
        if (isStepFailed(label)) {
          labelProps.error = true;
        }
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{t(label)}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  </>
);

export default Steppers;
