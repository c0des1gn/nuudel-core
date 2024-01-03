import React from 'react';
import Author from './Author';
import Copyright from './Copyright';
import Date from './Date';
import { SocialList } from './SocialList';
import TagButton from './TagButton';
import { ITagContent } from 'nuudel-core';
import { IImage } from 'nuudel-core';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { MetaJson } from './meta/MetaJson';
import styles from './styles.module.scss';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';

type Props = {
  title: string;
  date: Date;
  slug: string;
  tags: ITagContent[];
  author: string;
  description?: string;
  children: React.ReactNode;
  withCopyright?: boolean;
  image?: string | IImage;
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
  image,
}: Props) {
  tags = !tags ? [] : tags;
  const keywords = tags.map((it) => it.name);
  const authorName = author;
  const meta = MetaJson({
    url: `/post/${slug}`,
    title: title,
    description: description,
    image: image,
  });
  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={meta.url}
        openGraph={{
          ...meta,
        }}
        twitter={{
          handle: process?.env?.TWITTER_USERNAME,
          site: process?.env?.TWITTER_USERNAME,
          cardType: 'summary_large_image',
        }}
      />
      <ArticleJsonLd
        useAppDir={false}
        type="BlogPosting"
        keywords={keywords.join(', ')}
        url={meta.url}
        title={meta.title}
        images={[typeof image === 'string' ? image : image?.uri].filter(
          Boolean
        )}
        datePublished={date.toISOString()}
        dateModified={date.toISOString()}
        authorName={authorName}
        description={meta.description}
      />
      <div className={'widget-post-container'}>
        <article>
          <header>
            <h1 className="post-title">{title}</h1>
            <div className={'widget-post-metadata'}>
              <CalendarMonthIcon fontSize="inherit" />
              <span>
                <Date date={date} />
              </span>
              <PersonIcon fontSize="inherit" />
              <span>
                <Author author={authorName} />
              </span>
            </div>
          </header>
          <div className={'widget-post-content'}>{children}</div>
        </article>
        <footer>
          <div className={'footer-lists'}>
            <div className={'social-list'}>
              <SocialList
                items={[
                  { name: 'facebook', link: '#' },
                  { name: 'twitter', link: '#' },
                  { name: 'instagram', link: '#' },
                ]}
              />
            </div>
            <div className={'tagList'}>
              {tags.map((it, i) => (
                <TagButton key={i} tag={it} />
              ))}
            </div>
          </div>
          {!!withCopyright && <Copyright />}
        </footer>
      </div>
    </>
  );
}
