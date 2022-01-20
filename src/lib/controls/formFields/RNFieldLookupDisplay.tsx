import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Text, Link } from '@Components';
import styles from './styles.module.scss';

const RNFieldLookupDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  if (props.value && props.value.length > 0) {
    let value = props.value;
    if (typeof props.value === 'string') {
      value = [value];
    }
    const baseUrl = `#`;
    return (
      <>
        {value.map((val, index) => (
          <Link
            className={styles.link}
            target="_blank"
            href={`${baseUrl}&ID=${val.lookupId}`}
          >
            {index > 1 && <Text>,</Text>}
            <Text className={styles.display}>
              {typeof val.lookupValue !== 'undefined' ? val.lookupValue : val}
            </Text>
          </Link>
        ))}
      </>
    );
  } else {
    return <></>;
  }
};

export default RNFieldLookupDisplay;
