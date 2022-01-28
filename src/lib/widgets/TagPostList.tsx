import React from 'react';
import { IPostContent, ITagContent } from '../library/IBlog';
import PostItem from './PostItem';
import Pagination from './Pagination';
import styles from './styles.module.scss';

interface Props {
  posts: IPostContent[];
  tag: ITagContent;
  pagination: {
    current: number;
    pages: number;
  };
}
export default function TagPostList({
  posts = [],
  tag = { name: '', slug: '' },
  pagination = {
    current: 1,
    pages: 1,
  },
}: Props) {
  return (
    <div className={styles.widgetTagPostContainer}>
      <h1>
        All posts / <span>{tag.name}</span>
      </h1>
      <ul>
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
          href: () => '/posts/tags/[[...slug]]',
          as: (page) =>
            page === 1
              ? '/posts/tags/' + tag.slug
              : `/posts/tags/${tag.slug}/${page}`,
        }}
      />
    </div>
  );
}
