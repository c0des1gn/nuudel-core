import { useState } from 'react';
import { Link, Text } from 'nuudel-core';
import TagLink from './TagLink';
import { t } from '../loc/i18n';
import Burger from './Burger';
import { ITagContent } from 'nuudel-core';
import styles from './styles.module.scss';

const testTags = [
  { name: 'test', slug: 'test' },
  { name: 'tags', slug: 'tags' },
];

export interface ICategory {
  name: string;
  slug: string;
  parent_id: string;
  hasChild: boolean;
  cid: string;
}

type Props = {
  category: ICategory[];
  tags?: ITagContent[];
  query?: any;
};

export default function Navigation({ category, tags = [], query }: Props) {
  // const [active, setActive] = useState(false);
  const { slug, page } = query || require('next/router')?.query;
  let _slug: string = slug instanceof Array ? slug.join('/') : slug;

  return (
    <>
      <nav>
        {/* <Burger active={active} onClick={() => setActive(!active)} /> */}
        <div
          className={
            'widget-navigation-container'
            // + (active ? 'widget-navigation-active' : '')
          }
        >
          <Text fontWeight={700} gutterBottom>
            {t('Category')}{' '}
          </Text>
          <ul>
            {category ? (
              category
                .filter((cat) => cat['parent_id'] === null)
                .map((cat, ind) => (
                  <li key={ind}>
                    <Link href={`/posts/category/${cat['cid']}`}>
                      <span
                        className={_slug === cat['cid'] ? 'active' : undefined}
                      >
                        {cat['name']}
                      </span>
                    </Link>
                    {console.log('cat.cid', cat['cid'])}
                    {category.filter((c) => c['parent_id'] === cat['cid'])
                      .length ? (
                      <ul
                        style={{
                          paddingLeft: '16px',
                          paddingTop: '8px',
                          marginBottom: '0',
                        }}
                      >
                        {category
                          .filter((c) => c['parent_id'] === cat.cid)
                          .map((c, i) => (
                            <li key={i}>
                              {console.log('c.cid', c['cid'])}
                              <Link href={`/posts/category/${c['cid']}`}>
                                <span
                                  className={
                                    _slug === c['cid'] ? 'active' : undefined
                                  }
                                >
                                  {c['name']}
                                </span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <></>
                    )}
                  </li>
                ))
            ) : (
              <></>
            )}
          </ul>
          <Text fontWeight={700} gutterBottom>
            {t('Tag')}{' '}
          </Text>
          <ul className={'widget-post-categories'}>
            {testTags.map((it, i) => (
              <li key={i}>
                <TagLink tag={it} />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
