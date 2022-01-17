import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import styles from './styles.module.scss';

const RNFieldObjectDisplay: React.FunctionComponent<IRNFormFieldProps> = props => {
  let value: string = props.value
    ? typeof props.value === 'object'
      ? JSON.stringify(props.value)
      : props.value
    : '';

  return <div className={styles.display}>{value}</div>;
};

export default RNFieldObjectDisplay;
