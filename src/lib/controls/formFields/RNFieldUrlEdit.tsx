import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { ControlMode } from 'nuudel-utils';
import { TextField } from '../../components';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import styles from './styles.module.scss';
import { connect } from 'react-redux';

const RNFieldUrlEdit: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  const { disabled } = storeProps(props);
  return (
    <TextField
      className={styles.url}
      //autoComplete={''}
      //defaultValue={props.fieldSchema.DefaultValue}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.DefaultValue &&
        typeof props.value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : props.value
      }
      required={
        props?.required === true || props?.fieldSchema?.Required === true
      }
      fullWidth
      disabled={props.disabled || disabled}
      variant="outlined"
      type="url"
      inputProps={{ maxLength: 1024 }}
      onChange={(e: any) => props.valueChanged(e.target.value)}
      autoCapitalize={'none'}
      placeholder={t('UrlFormFieldPlaceholder')}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldUrlEdit);
