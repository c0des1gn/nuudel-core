import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { TextField } from '../../components';
import { ControlMode } from 'nuudel-utils';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { getLocale } from './RNFieldDateEdit';

const RNFieldNumberEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  // We need to set value to empty string when null or undefined to force TextField
  // not to be used like an uncontrolled component and keep current value
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);
  return (
    <TextField
      className={styles.number}
      disabled={props.disabled || disabled}
      required={
        props?.required === true || props?.fieldSchema?.Required === true
      }
      inputProps={{ maxLength: props.fieldSchema.MaxLength }}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.DefaultValue &&
        typeof value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : isNaN(value)
          ? value
          : value.toString()
      }
      fullWidth
      type="number"
      variant="outlined"
      autoCapitalize="none"
      onChange={(e: any) => props.valueChanged(parseNumber(e.target.value))}
      placeholder={'0'} //t('NumberFormFieldPlaceholder')
    />
  );
};

const parseNumber = (value, locale = getLocale()): number => {
  const decimalSperator = Intl.NumberFormat(locale).format(1.1).charAt(1);
  // const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
  const cleanPattern = new RegExp(
    `[${"' ,.".replace(decimalSperator, '')}]`,
    'g'
  );
  const cleaned = value.replace(cleanPattern, '');
  const normalized = cleaned.replace(decimalSperator, '.');
  return Number(normalized);
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldNumberEdit);
