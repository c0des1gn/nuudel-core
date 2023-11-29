import { generatePagination } from 'nuudel-core';
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
    <ul className={'widget-pagination'}>
      {pagination.map((it, i) => {
        return (
          <li key={i}>
            {!it.excerpt ? (
              <Link
                href={link.href(it.page)}
                as={link.as(it.page)}
                className={
                  it.page === current || it.current ? 'active' : undefined
                }
              >
                <span>{it.page}</span>
              </Link>
            ) : (
              '...'
            )}
          </li>
        );
      })}
    </ul>
  );
}
