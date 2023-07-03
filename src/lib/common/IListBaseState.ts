export interface IListBaseState {
  search?: string;
  total: number;
  filter: any;
  sorting: string;
  pageSize: number;
  currentPage: number;
  listname?: string;
  columns?: string;
  fetchPolicy?: string;
}

interface IProviderCore {
  query?: string;
  listname?: string;
  columns?: string;
}

export interface IProviderBase extends IProviderCore {
  ID: string;
  pid?: string;
  variants?: boolean;
  q?: string;
  depth?: number;
}

export interface IProviderItems extends IProviderCore {
  Ids: any[];
}
