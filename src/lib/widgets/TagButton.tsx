import { Link } from 'nuudel-core';
import styles from './styles.module.scss';
import { ITagContent } from '../library/IBlog';

interface Props {
  tag: ITagContent;
}
export default function TagButton({ tag }: Props) {
  const name = !tag ? '' : tag.name;
  const slug = !tag ? '' : tag.slug;
  return (
    <>
      <Link href={'/posts/tags/[[...slug]]'} as={`/posts/tags/${slug}`}>
        <span className={styles.widgetTagButton}>{name}</span>
      </Link>
    </>
  );
}
