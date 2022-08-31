import moment from 'moment';
import styles from './styles.module.scss';

type Props = {
  date: Date;
};
export default function Date({date}: Props) {
  return (
    <time dateTime={moment(date).toISOString()}>
      <span className={'widget-color'}>{moment(date).format('llll')}</span>
    </time>
  );
}
