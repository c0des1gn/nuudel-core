import React from 'react';
import { Stepper, StepperProps, Step, StepLabel } from '@material-ui/core';
import { t } from '../../loc/i18n';

interface IStepperProps extends StepperProps {
  status: string;
  step?: number;
  steps: string[];
  failedSteps: string[];
}

const isStepFailed = (status: string, failedSteps: string[]) => {
  let failedStatus: boolean = false;
  if (failedSteps.includes(status)) {
    failedStatus = true;
  }
  return failedStatus;
};

const Steppers: React.FC<IStepperProps> = ({
  children,
  failedSteps = [],
  steps = [],
  step = 0,
  ...props
}) => (
  <>
    {children}
    <Stepper
      {...props}
      activeStep={step}
      alternativeLabel
      style={{ width: '100%' }}
    >
      {steps.map((label, index) => {
        const stepProps: { completed?: boolean } = {};
        const labelProps: {
          error?: boolean;
        } = {};
        if (isStepFailed(label, failedSteps)) {
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
