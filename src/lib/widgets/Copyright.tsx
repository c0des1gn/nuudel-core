import styles from './styles.module.scss';
import { Text, Link } from 'nuudel-core';

export default function Copyright() {
  return (
    <Text variant="body2" color="textSecondary" align="center">
      {
        'Powered by ' //'Copyright © '
      }
      <Link
        color="inherit"
        className={styles.widgetColor}
        href={'http://codesign.mn'}
      >
        Codesign
      </Link>{' '}
      {new Date().getFullYear()}
    </Text>
  );
}
