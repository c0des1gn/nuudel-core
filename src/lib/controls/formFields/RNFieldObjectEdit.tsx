import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { t } from '@Translate';
import { ControlMode } from '../../common/ControlMode';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { TextField } from '@Components';
import { getValue, changeProp } from '../../redux/actions/fields';
import styles from './styles.module.scss';
import { connect } from 'react-redux';

const RNFieldObjectEdit: React.FunctionComponent<IRNFormFieldProps> = props => {
  // We need to set value to empty string when null or undefined to force TextField still be used like a controlled component
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);
  return !props.fieldSchema.IsArray ? (
    <TextField
      className={styles.object}
      disabled={props.disabled || disabled}
      required={
        props?.required === true || props?.fieldSchema?.Required === true
      }
      key={props.fieldSchema.InternalName}
      fullWidth
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.FieldType !== 'Note' &&
        props.fieldSchema.DefaultValue &&
        typeof props.value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : value
      }
      variant="outlined"
      onChange={(e: any) => props.valueChanged(e.target.value)}
      placeholder={t('TextFormFieldPlaceholder')}
    />
  ) : (
    <></>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldObjectEdit);
