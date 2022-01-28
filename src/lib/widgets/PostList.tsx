import React from 'react';
import PostItem from './PostItem';
import TagLink from './TagLink';
import Pagination from './Pagination';
import { ITagContent, IPostContent } from '../library/IBlog';
import styles from './styles.module.scss';

interface Props {
  posts: IPostContent[];
  tags: ITagContent[];
  pagination: {
    current: number;
    pages: number;
  };
}
export default function PostList({ posts, tags, pagination }: Props) {
  return (
    <div className={styles.widgetPostListContainer}>
      <div className={styles.widgetPosts}>
        <ul className={styles.widgetPostList}>
          {posts.map((it, i) => (
            <li key={i}>
              <PostItem post={it} />
            </li>
          ))}
        </ul>
        <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? '/posts' : '/posts/page/[page]'),
            as: (page) => (page === 1 ? null : '/posts/page/' + page),
          }}
        />
      </div>
      <ul className={styles.widgetPostCategories}>
        {tags.map((it, i) => (
          <li key={i}>
            <TagLink tag={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}
