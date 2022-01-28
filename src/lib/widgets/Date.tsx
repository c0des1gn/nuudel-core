import moment from 'moment';
import styles from './styles.module.scss';

type Props = {
  date: Date;
};
export default function Date({ date }: Props) {
  return (
    <time dateTime={moment(date).toISOString()}>
      <span className={styles.widgetColor}>
        {moment(date).format('LLLL d, yyyy')}
      </span>
    </time>
  );
}
