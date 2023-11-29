import React from 'react';
import PostItem from './PostItem';
import TagLink from './TagLink';
import Pagination from './Pagination';
import { ITagContent, IPostContent } from 'nuudel-core';
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
  console.log(
    'pagi current',
    pagination.current,
    'pagi pages',
    pagination.pages
  );
  return (
    <div className={'widget-post-list-container'}>
      <div className={'widget-posts'}>
        <ul className={'widget-post-list'}>
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
      <ul className={'widget-post-categories'}>
        {tags.map((it, i) => (
          <li key={i}>
            <TagLink tag={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}
