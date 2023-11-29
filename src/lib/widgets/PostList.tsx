import React from 'react';
import PostItem from './PostItem';
import Pagination from './Pagination';
import { IPostContent } from 'nuudel-core';
import styles from './styles.module.scss';

interface Props {
  posts: IPostContent[];
  pagination: {
    current: number;
    pages: number;
  };
}
export default function PostList({ posts, pagination }: Props) {
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
            href: page => (!page ? '/posts' : `/posts?page=${page}`),
            as: page => (!page ? '/posts' : `/posts?page=${page}`),
          }}
        />
      </div>
    </div>
  );
}
