import { useState } from 'react';
import { Link } from 'nuudel-core';
import { useRouter } from 'next/router';
import TagLink from './TagLink';
import { t } from '../loc/i18n';
import Burger from './Burger';
import { ITagContent } from 'nuudel-core';
import styles from './styles.module.scss';

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
};

export default function Navigation({ category, tags = [] }: Props) {
  const router = useRouter();
  // const [active, setActive] = useState(false);

  return (
    <>
      <div>{t('Category')} </div>
      <nav>
        {/* <Burger active={active} onClick={() => setActive(!active)} /> */}
        <div
          className={
            'widget-navigation-container'
            // + (active ? 'widget-navigation-active' : '')
          }
        >
          <ul>
            {category ? (
              category
                .filter((cat) => cat['parent_id'] === null)
                .map((cat, i) => (
                  <li key={i}>
                    <Link href={`/posts/category/${cat['cid']}`}>
                      <span
                        className={
                          router.pathname === '/'
                            ? 'widget-navigation-active'
                            : undefined
                        }
                      >
                        {cat['name']}
                      </span>
                    </Link>
                  </li>
                ))
            ) : (
              <></>
            )}
          </ul>
        </div>
      </nav>
      <>
        <div>{t('Tag')} </div>
        <ul className={'widget-post-categories'}>
          {tags.map((it, i) => (
            <li key={i}>
              <TagLink tag={it} />
            </li>
          ))}
        </ul>
      </>
    </>
  );
}
