import { IPostContent, ITagContent } from 'nuudel-core';
import Date from './Date';
import { Link, Text } from 'nuudel-core';
import { titleShorter, decodeHTML } from 'nuudel-utils';
import moment from 'moment';
import styles from './styles.module.scss';
import { getTextFromHtml } from '../common/helper';
import TagButton from './TagButton';

interface Props {
  post: IPostContent;
  showDetail?: boolean;
}

export default function PostItem({ post }: Props, props: Props) {
  const tags: ITagContent[] = !post.tags
    ? []
    : post.tags.map((tag) => ({
        name: tag,
        slug: tag,
      }));

  return (
    <div className="post-list-item">
      <Link noLinkStyle href={'/post/' + post.slug}>
        <h2 className="post-list-title">{post.title}</h2>
      </Link>
      <p className="post-list-excerpt">
        {post['excerpt'] ? (
          titleShorter(post['excerpt'], 512)
        ) : !props.showDetail ? (
          titleShorter(getTextFromHtml(post.content), 512)
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </p>
      <div className="post-list-metadata">
        {/* <Link href={'/posts/' + post.slug} className="post-list-date"> */}
        <p>{post.author}</p>
        <Date date={moment(post.publishdate).toDate()} />
      </div>
      {tags.length ? (
        <div className={'tagList'}>
          {tags.map((it, i) => (
            <TagButton key={i} tag={it} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
