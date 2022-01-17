import React from 'react';
import { Text, Label } from '@Components';
import { ControlMode } from '../../common/ControlMode';
import { IFieldSchema } from '../../services/datatypes/RenderListData';
import { DelayedRender } from '../../common/DelayedRender';
import styles from './styles.module.scss';
import { t } from '@Translate';

export interface IFormFieldProps {
  className?: string;
  controlMode: ControlMode;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  active?: boolean;
  value: any;
  fieldSchema: IFieldSchema;
  errorMessage?: string;
  valueChanged(newValue: any): void;
}

const FormField: React.FunctionComponent<IFormFieldProps> = props => {
  const {
    children,
    disabled,
    description,
    required,
    active,
    errorMessage,
    fieldSchema,
    controlMode,
    hidden,
  } = props;

  let label = props.label;
  const isDescriptionAvailable: boolean = Boolean(description || errorMessage);

  return hidden ? null : (
    <div className={styles.formfield}>
      <div style={{ flexDirection: 'row' }}>
        {!!label && (
          <Label style={{}}>
            {label}
            {required && (
              <Text style={{ display: 'inline', padding: 0 }}>*</Text>
            )}
            :
          </Label>
        )}
        <div style={props.controlMode === ControlMode.Display ? {} : {}}>
          {children}
        </div>
      </div>
      {isDescriptionAvailable && (
        <div style={{}}>
          {!!errorMessage && (
            <DelayedRender>
              <Text>{errorMessage}</Text>
            </DelayedRender>
          )}
          {props.controlMode !== ControlMode.Display && !!description && (
            <Text className={styles.description}>{description}</Text>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
