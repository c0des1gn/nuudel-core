import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './IListBaseState';

export default interface IDataProvider {
  validateSettings(): boolean;
  defaultFilters(): any;
  Sorting(): any[];
  filterOptions(): any;
  GetItem(param: IProviderBase): Promise<any>;
  GetItems(param: IProviderItems, fieldgroups?: string): Promise<any>;
  GetBrowseNodes(param: IProviderBase): Promise<any>;
  GetVariations(param: IProviderBase): Promise<any>;
  readListData(state: IListBaseState, isCached?: boolean): Promise<any>;
  getDealItems?(param: IProviderBase): Promise<any>;
  GetAvailability?(itemIds: string[]): Promise<any>;
  GetCategorySuggestions?(param: IProviderBase): Promise<any>;
  getFields?(listname: string, callback?: Function): Promise<any[]>;
  setQuery?(query?: string, columns?: string): void;
  lfs?;
  category?: any;
  callback?: Function;
}
