import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Switch } from '@material-ui/core';
import { t } from 'nuudel-utils';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import styles from './styles.module.scss';
import { connect } from 'react-redux';

const RNFieldBooleanEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  let value = props.value;
  const { disabled } = storeProps(props);
  if (
    props.controlMode === ControlMode.New &&
    typeof props.value === 'undefined'
  ) {
    value = props.fieldSchema.DefaultValue;
  }
  return (
    <div className={styles.bool}>
      <Switch
        className={styles.toggle}
        disabled={props.disabled || disabled}
        checked={value === '1' || value === 'true' || value === 'Yes' || value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.valueChanged(e.target.checked)
        }
        name="checkedB"
        color="primary"
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldBooleanEdit);
