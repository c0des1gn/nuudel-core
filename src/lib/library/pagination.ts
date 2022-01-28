export interface IPagination {
  page: number | null;
  current: boolean;
  excerpt: boolean;
}

export const generatePagination = function (
  current: number,
  pages: number
): IPagination[] {
  return Array.from(Array(pages).keys())
    .map((it) => it + 1)
    .filter((it) => it === 1 || it === pages || Math.abs(current - it) <= 2)
    .map((it) => ({
      page:
        Math.abs(current - it) === 2 && it !== 1 && it !== pages ? null : it,
      current: it === current,
      excerpt: Math.abs(current - it) === 2 && it !== 1 && it !== pages,
    }));
};
