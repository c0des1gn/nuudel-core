import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Link } from '../../components';
import styles from './styles.module.scss';

const RNFieldUrlDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  if (props.value && isValidURL(props.value)) {
    return (
      <Link className={styles.link} target="_blank" href={props.value}>
        {getDomain(props.value)}
      </Link>
    );
  } else {
    return <></>;
  }
};

export const getDomain = (url: string) => {
  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch {}
  return hostname;
};

export const isValidURL = (uri: string) => {
  let res = uri.match(
    /^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))?$/g
  );
  return res !== null;
};

export default RNFieldUrlDisplay;
