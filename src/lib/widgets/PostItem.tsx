import { IPostContent, ITagContent } from 'nuudel-core';
import Date from './Date';
import { Link, Text } from 'nuudel-core';
import { titleShorter, decodeHTML } from 'nuudel-utils';
import moment from 'moment';
import styles from './styles.module.scss';
import { getTextFromHtml } from 'nuudel-core';
import TagButton from './TagButton';
import Author from './Author';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';

interface Props {
  post: IPostContent;
  showDetail?: boolean;
}

export default function PostItem({ post }: Props, props: Props) {
  const tags: ITagContent[] = !post.tags
    ? []
    : post.tags.map(tag => ({
        name: tag,
        slug: tag,
      }));

  return (
    <div className="post-list-item">
      <Link noLinkStyle href={'/post/' + post.slug}>
        <h2 className="post-list-title">{post.title}</h2>
      </Link>
      <div className="post-list-metadata">
        {/* <Link href={'/posts/' + post.slug} className="post-list-date">Read more<Link> */}
        <CalendarMonthIcon fontSize="inherit" />
        <span>
          <Date date={moment(post.publishdate).toDate()} />
        </span>
        <PersonIcon fontSize="inherit" />
        <span>
          <Author author={post.author} />
        </span>
      </div>
      <p className="post-list-excerpt">
        {post['excerpt'] ? (
          titleShorter(post['excerpt'], 512)
        ) : !props.showDetail ? (
          titleShorter(getTextFromHtml(post.content), 512)
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </p>
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
