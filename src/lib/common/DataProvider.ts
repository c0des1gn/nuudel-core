import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './IListBaseState';
import IDataProvider from './IDataProvider';
import gql from 'graphql-tag';
import { IListFormService } from '../services/IListFormService';
import { getPlural, decodeHTML, dateToString } from 'nuudel-utils';
import { clientError } from './helper';
import { t } from '../loc/i18n';
import { FetchPolicy } from '@apollo/client';

export default class DataProvider implements IDataProvider {
  private _lfs: IListFormService;
  private _query: string = '';
  private readonly _listname: string = 'Product';
  private _category: any = [];
  private readonly _fetchPolicy: FetchPolicy = 'no-cache'; //'network-only',

  private columns: string = `
  _id
  _createdby
  _modifiedby
  createdAt
  updatedAt
  `;
  constructor(lfs: IListFormService, query?: string, columns?: string) {
    this._lfs = lfs;
    if (columns) {
      this.columns = columns;
    }
    if (query) {
      this._query = query;
    } else {
      this.getQuery(this._listname).then((query) => {
        this._query = query;
      });
    }
  }

  initCategory() {
    this.GetBrowseNodes({ ID: '', columns: 'cid, name', depth: 1 }).then(
      (r) => {
        if (r) {
          this._category = r;
        }
      }
    );
  }

  public get category() {
    if (this._category && this._category.length === 0) {
      this.initCategory();
    }
    return this._category;
  }

  public get lfs() {
    return this._lfs;
  }

  public Sorting() {
    return [
      { label: t('BestMatch'), value: '' },
      { label: t('LowestPriceShipping'), value: '{"price.value": 1}' },
      { label: t('HighestPriceShipping'), value: '{"price.value": -1}' },
      { label: t('EndingSoonest'), value: '{"expired": 1}' },
      { label: t('NewlyListed'), value: '{"createdAt": -1}' },
    ];
  }

  public defaultFilters() {
    return {
      availability: 'IN_STOCK',
    };
  }

  public filterOptions() {
    return [
      {
        name: 'categoryId',
        type: 'select',
        text: t('Categories'),
        choices: this._category.map((item) => ({
          value: item.cid,
          label: item.name,
        })),
        default: '',
      },
      {
        name: 'condition',
        type: 'multiselect',
        text: t('Conditions'),
        choices: [
          { value: 'New', label: t('New') },
          { value: 'Used', label: t('Used') },
          { value: 'OpenBox', label: t('OpenBox') },
          { value: 'Refurbished', label: t('Refurbished') },
          { value: 'Parts', label: t('Parts') },
        ],
        default: [],
      },
      {
        name: 'MinPrice',
        type: 'number',
        text: t('MinPrice'),
      },
      {
        name: 'MaxPrice',
        type: 'number',
        text: t('MaxPrice'),
      },
    ];
  }

  private async getQuery(listname) {
    let query = '';
    try {
      const fieldsSchema = await this._lfs.getFieldSchemasForForm(listname);
      query = this._lfs.listQuery(listname, fieldsSchema);
    } catch {}
    return query;
  }

  public validateSettings(): boolean {
    if (!this._lfs) {
      return false;
    }
    return true;
  }

  public async getFields(
    listname: string,
    callback?: Function
  ): Promise<any[]> {
    const fieldsSchema = await this._lfs.getFieldSchemasForForm(listname);
    const fields = fieldsSchema
      .filter(
        (field) =>
          !!field.FieldType &&
          (field.FieldType !== 'Object' || !!callback) &&
          !field.InternalName?.endsWith('.createdAt') &&
          !field.InternalName?.endsWith('.updatedAt')
      )
      .map((field) => {
        let f = {
          title: field.Title,
          name: field.InternalName,
        };
        if (field.FieldType === 'Image') {
          f['getCellValue'] = (row) => {
            const dat = field.InternalName.includes('.')
              ? field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                )
              : row[field.InternalName];
            return !dat?.uri ? '--' : dat.uri;
          };
        } else if (field.FieldType === 'Boolean') {
          f['getCellValue'] = (row) => {
            const dat = field.InternalName.includes('.')
              ? field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                )
              : row[field.InternalName];
            return dat ? t('Yes') : dat === false ? t('No') : '--';
          };
        } else if (field.FieldType === 'DateTime') {
          f['getCellValue'] = (row) => {
            const dat = field.InternalName.includes('.')
              ? field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                )
              : row[field.InternalName];
            return !dat ? '--' : dateToString(dat, 'YYYY/MM/DD HH:mm');
          };
        } else if (field.FieldType === 'MultiChoice') {
          f['getCellValue'] = (row) => {
            const dat = field.InternalName.includes('.')
              ? field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                )
              : row[field.InternalName];
            return dat instanceof Array ? dat.join(', ') : '--';
          };
        } else if (field.FieldType === 'Note') {
          f['getCellValue'] = (row) => {
            const dat = field.InternalName.includes('.')
              ? field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                )
              : row[field.InternalName];
            return !dat ? '--' : decodeHTML(dat);
          };
        } else if (
          field.InternalName.includes('.') ||
          field.FieldType === 'Object'
        ) {
          f['getCellValue'] = !callback
            ? (row) => {
                const dat = field.InternalName.split('.').reduce(
                  (d, f) => (!d[f] ? d : d[f]),
                  row
                );
                return !dat || typeof dat === 'object' ? '--' : dat;
              }
            : (row) => callback(row, field.InternalName);
        }
        return f;
      });

    return fields;
  }

  public async GetItem(param: IProviderBase): Promise<any> {
    let { ID, columns, listname } = param;
    listname = listname || this._listname;
    let r: any = false;

    //r = await this._lfs.itemById(listname, ID);
    try {
      r = await this._lfs.client.query({
        query: gql`query Get${listname}($_id: ObjectId!){
        get${listname}(_id: $_id) {
          ${!columns ? this.columns : columns}
        }
      }`,
        variables: { _id: ID },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`get${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve({});
    }
  }

  public async GetItems(param: IProviderItems, options?: string): Promise<any> {
    let { Ids, columns, listname } = param;
    listname = listname || this._listname;
    let r: any = false;
    if (typeof Ids === 'undefined') {
      return Promise.resolve([]);
    }

    //r = await this._lfs.viewItems(listname, {filter: `{"_id": {"$in": ["${Ids.join('","')}"]} }`});
    try {
      r = await this._lfs.client.query({
        query: gql`query GetAll${listname}($filter: String, $sort: String, $limit: Int) {
        getAll${listname}(filter: $filter, sort: $sort, limit: $limit) {
          ${
            !columns
              ? `_id, title, image, condition, color, Size, availability, quantity, price {value, currency},
               oldPrice, shortDesc, shipping {ServiceCode, quantityEstimate, ShippingCost{currency,value}}`
              : columns
          }
      }}`,
        variables: {
          filter: `{"_id": {"$in": ["${Ids.join('","')}"]} }`,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`getAll${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve([]);
    }
  }

  public async GetBrowseNodes(param: IProviderBase): Promise<any> {
    let { ID, columns, depth } = param;
    const listname = 'Category';
    let r: any = false;
    try {
      r = await this._lfs.client.query({
        query: gql`
      query GetChild${listname}($id: String, $depth: Int) {
        getChild${listname}(id: $id, depth: $depth) {
          ${!columns ? 'cid, name, slug, parent_id, img' : columns}
        }
      }
    `,
        variables: {
          id: !ID ? null : ID,
          depth: depth,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }
    if (r?.data) {
      return Promise.resolve(r.data[`getChild${listname}`]);
    } else {
      return Promise.resolve([]);
    }
  }

  public async GetVariations(param: IProviderBase): Promise<any> {
    let { ID, columns } = param;
    const listname = 'Itemgroup';
    let r: any = false;

    //r = await this._lfs.itemById(listname, ID);

    try {
      r = await this._lfs.client.query({
        query: gql`query Get${listname}($_id: ObjectId!){
        get${listname}(_id: $_id) {
          ${
            !columns
              ? `_id,
            article,
            items {${this.columns}},
            itemIds,
            attributeValues { Name, Value }`
              : columns
          }
        }
      }
      `,
        variables: {
          _id: ID,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`get${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve({
        items: [],
      });
    }
  }

  public async readListData(state: IListBaseState): Promise<any> {
    let {
      sorting,
      pageSize,
      currentPage,
      total,
      search,
      listname,
      fetchPolicy = this._fetchPolicy,
    } = state;
    search = typeof search !== 'undefined' ? search.trim() : undefined;
    let filter =
      typeof state.filter === 'object' ? { ...state.filter } : state.filter;

    const emptyResult = {
      itemSummaries: [],
      total: 0,
      next: false,
      offset: 0,
      limit: 0,
    };

    if (listname === this._listname && typeof search === 'undefined') {
      return Promise.resolve(emptyResult);
    }

    filter = !filter
      ? '{}'
      : typeof filter === 'object'
      ? JSON.stringify(filter)
      : filter;
    if (!!search) {
      const sort = '"score": { "$meta": "textScore" }';
      if (!filter || filter === '{}') {
        filter = `{ "$text": { "$search": "${search}", "$caseSensitive": true } }`;
      } else {
        filter = `{ "$and": [ ${filter} , { "$text": { "$search": "${search}", "$caseSensitive": true } } ]}`;
      }
      sorting =
        sorting?.trim().startsWith('{') && sorting !== '{}'
          ? '{' + sort + ',' + sorting.trim().substring(1)
          : `{${sort}}`;
    }
    sorting = !sorting ? '{}' : sorting;

    const query =
      listname === this._listname && !!this._query
        ? this._query
        : await this.getQuery(listname || this._listname);
    if (!this._query && listname === this._listname) {
      this._query = query;
    }

    if (!query) {
      return Promise.resolve(emptyResult);
    }
    let r: any = false;
    try {
      r = await this._lfs.client.query({
        query: gql`
          ${query}
        `,
        variables: {
          filter: filter,
          sort: sorting,
          total: total,
          skip: pageSize * (currentPage > 0 ? currentPage - 1 : 0),
          take: pageSize,
        },
        fetchPolicy: fetchPolicy as FetchPolicy,
        //errorPolicy: 'all',
      });
    } catch (err) {
      console.warn(err);
      return Promise.resolve(emptyResult);
    }

    if (r && r.data) {
      return Promise.resolve(r.data[`get${getPlural(listname)}s`]);
    } else {
      this.onError(r);
      await clientError(r);
      return Promise.resolve(emptyResult);
    }
  }

  protected onError(e) {
    //console.warn(e);
  }
}
