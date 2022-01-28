import { Link } from 'nuudel-core';
import { useRouter } from 'next/router';
import Burger from './Burger';
import { useState } from 'react';
import styles from './styles.module.scss';

export default function Navigation() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  return (
    <>
      <Burger active={active} onClick={() => setActive(!active)} />
      <div
        className={
          styles.widgetNavigationContainer +
          (active ? styles.widgetNavigationActive : '')
        }
      >
        <ul>
          <li>
            <Link href="/">
              <span
                className={
                  router.pathname === '/' ? styles.widgetNavigationActive : null
                }
              >
                about
              </span>
            </Link>
          </li>
          <li>
            <Link href="/posts">
              <span
                className={
                  router.pathname.startsWith('/posts') ? styles.active : null
                }
              >
                blog
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
