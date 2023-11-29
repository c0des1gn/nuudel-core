import { Link } from 'nuudel-core';
import { ITagContent } from 'nuudel-core';

interface Props {
  tag: ITagContent;
}
export default function Tag({ tag }: Props) {
  return (
    <Link href={'/posts/tags/[[...slug]]'} as={`/posts/tags/${tag.slug}`}>
      {'#' + tag.name}
    </Link>
  );
}
