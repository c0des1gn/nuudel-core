import { Link } from 'nuudel-core';
import styles from './styles.module.scss';
import { ITagContent } from 'nuudel-core';

interface Props {
  tag: ITagContent;
}
export default function TagButton({ tag }: Props) {
  const name = !tag ? '' : tag.name;
  const slug = !tag ? '' : tag.slug;
  return (
    <>
      <Link href={'/posts/tags/[[...slug]]'} as={`/posts/tags/${slug}`}>
        <span className={'widget-tag-button'} title={slug}>
          {name.length > 22 ? name.substring(0, 22) + '...' : name}
        </span>
      </Link>
    </>
  );
}
