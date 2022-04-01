import React, { FC } from 'react';
import styles from './styles.module.scss';
import { Text, Link } from 'nuudel-core';

export const Copyright: FC<any> = ({ ...props }) => {
  return (
    <Text variant="body2" color="textSecondary" align="center">
      {
        'Powered by ' //'Copyright © '
      }
      <Link
        color="inherit"
        style={{ color: '#9b9b9b' }}
        //className={styles.widgetColor}
        href={'https://codesign.mn'}
      >
        Codesign
      </Link>{' '}
      {new Date().getFullYear()}
    </Text>
  );
};

export default Copyright;
