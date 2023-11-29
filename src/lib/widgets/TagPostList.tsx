import React from 'react';
import { IPostContent, ITagContent } from 'nuudel-core';
import PostItem from './PostItem';
import Pagination from './Pagination';
import { t } from '../loc/i18n';
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
    <div className={'widget-tag-post-container'}>
      <h1>
        {t('All posts')} / <span>{tag.name}</span>
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
          href: (page) =>
            !page
              ? `/posts/tags/[[...slug]]`
              : `/posts/tags/[[...slug]]?page=${page}`,
          as: (page) =>
            !page
              ? `/posts/tags/${tag.slug}`
              : `/posts/tags/${tag.slug}?page=${page}`,
        }}
      />
    </div>
  );
}
