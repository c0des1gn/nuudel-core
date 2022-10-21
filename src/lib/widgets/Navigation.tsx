import { Link } from 'nuudel-core';
import { useRouter } from 'next/router';
import Burger from './Burger';
import { useState } from 'react';
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
};

export default function Navigation({ category }: Props) {
  const router = useRouter();
  // const [active, setActive] = useState(false);

  return (
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
              .filter((cata) => cata['parent_id'] === null)
              .map((cat, i) => (
                <li>
                  <Link key={i} href={`/posts/category/${cat['cid']}`}>
                    <span
                    // className={router.pathname === '/' ? 'widget-navigation-active' : null}
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
  );
}
