import moment from 'moment';
import styles from './styles.module.scss';

type Props = {
  date: Date;
};
export default function Date({ date }: Props) {
  return (
    <time dateTime={moment(date).toISOString()}>
      <span className={'widget-color'} title={moment(date).format('llll')}>
        {moment(date).format('YYYY/MM/DD')}
      </span>
    </time>
  );
}
