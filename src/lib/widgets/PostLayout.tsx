import React from 'react';
import Author from './Author';
import Copyright from './Copyright';
import Date from './Date';
import Layout from './Layout';
import BasicMeta from './meta/BasicMeta';
import JsonLdMeta from './meta/JsonLdMeta';
import OpenGraphMeta from './meta/OpenGraphMeta';
import TwitterCardMeta from './meta/TwitterCardMeta';
import {SocialList} from './SocialList';
import TagButton from './TagButton';
import {ITagContent} from '../library/IBlog';
import styles from './styles.module.scss';

type Props = {
  title: string;
  date: Date;
  slug: string;
  tags: ITagContent[];
  author: string;
  description?: string;
  children: React.ReactNode;
  withCopyright?: boolean;
};
export default function PostLayout({
  title,
  date,
  slug,
  author,
  tags,
  description = '',
  children,
  withCopyright = false,
}: Props) {
  tags = !tags ? [] : tags;
  const keywords = tags.map(it => it.name);
  const authorName = author;
  return (
    <>
      <BasicMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
      <JsonLdMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
      />
      <div className={'widget-post-container'}>
        <article>
          <header>
            <h1 className="post-title">{title}</h1>
            <div className={'widget-post-metadata'}>
              <p>
                <Date date={date} />
              </p>
              <p>
                <Author author={authorName} />
              </p>
            </div>
          </header>
          <div className={'widget-post-content'}>{children}</div>
          <div className={'tagList'}>
            {tags.map((it, i) => (
              <TagButton key={i} tag={it} />
            ))}
          </div>
        </article>
        <footer>
          <div className={'social-list'}>
            <SocialList />
          </div>
          {!!withCopyright && <Copyright />}
        </footer>
      </div>
    </>
  );
}
