import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { TextField } from 'nuudel-components';
import { t } from 'nuudel-utils';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import styles from './styles.module.scss';

const RNFieldTextEdit: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  // We need to set value to empty string when null or undefined to force TextField still be used like a controlled component
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);

  return props.fieldSchema.FieldType !== 'Note' ? (
    <TextField
      disabled={props.disabled || disabled}
      className={styles.text}
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
      onChange={(e: any) => props.valueChanged(e.target.value)} //mapDispatchToProps(val,props)
      placeholder={t('TextFormFieldPlaceholder')}
      //canRevealPassword
      //revealPasswordAriaLabel="Show password"
      inputProps={{ maxLength: props.fieldSchema.MaxLength }}
      type={props.fieldSchema.InternalName === 'password' ? 'password' : 'text'}
    />
  ) : (
    <TextField
      className={styles.textarea}
      disabled={props.disabled || disabled}
      required={
        props?.required === true || props?.fieldSchema?.Required === true
      }
      fullWidth
      key={props.fieldSchema.InternalName}
      value={value}
      variant="outlined"
      multiline={true}
      onChange={(e: any) => props.valueChanged(e.target.value)}
      placeholder={t('TextFormFieldPlaceholder')}
      minRows={3}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldTextEdit);
