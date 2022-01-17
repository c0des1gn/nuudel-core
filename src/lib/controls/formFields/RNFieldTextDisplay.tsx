import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Text } from '@Components';
import styles from './styles.module.scss';

const RNFieldTextDisplay: React.FunctionComponent<IRNFormFieldProps> = props => {
  let value: string = props.value
    ? typeof props.value === 'string'
      ? props.value
      : JSON.stringify(props.value)
    : '';
  return <Text className={styles.display}>{value}</Text>;
};

export default RNFieldTextDisplay;
