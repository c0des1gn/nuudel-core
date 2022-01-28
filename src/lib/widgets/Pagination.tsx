import { generatePagination } from '../library/pagination';
import { Link } from 'nuudel-core';
import styles from './styles.module.scss';

type Props = {
  current: number;
  pages: number;
  link: {
    href: (page: number) => string;
    as: (page: number) => string;
  };
};
export default function Pagination({ current, pages, link }: Props) {
  const pagination = generatePagination(current, pages);
  return (
    <ul className={styles.widgetPagination}>
      {pagination.map((it, i) => (
        <li key={i}>
          {it.excerpt ? (
            '...'
          ) : (
            <Link href={link.href(it.page)} as={link.as(it.page)}>
              <span className={it.page === current ? styles.active : null}>
                {it.page}
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
