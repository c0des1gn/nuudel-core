import { IPostContent } from '../library/IBlog';
import Date from './Date';
import { Link } from 'nuudel-core';
import moment from 'moment';
import styles from './styles.module.scss';

interface Props {
  post: IPostContent;
}
export default function PostItem({ post }: Props) {
  return (
    <Link href={'/posts/' + post.slug}>
      <span className={styles.widgetPost}>
        <Date date={moment(post.date).toDate()} />
        <h2>{post.title}</h2>
      </span>
    </Link>
  );
}
