//import React from 'react';
import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './IListBaseState';
import gql from 'graphql-tag';
import { IListFormService } from '../services/IListFormService';
import { ListFormService as lfs } from '../services/ListFormService';
import { getPlural, decodeHTML, dateToString } from 'nuudel-utils';
import { clientError } from './helper';
import { t } from '../loc/i18n';
import { FetchPolicy } from '@apollo/client';
import IDataProvider from './IDataProvider';
import { IPaginatedVar, IPaginatedRes } from './Interfaces';

var _query = '';
var _columns = `
  _id
  _createdby
  _modifiedby
  createdAt
  updatedAt
  `;

function setQuery(query?: string, columns?: string) {
  if (query) {
    _query = query;
  }
  if (columns) {
    _columns = columns;
  }
}

const _listname: string =
  process?.env?.NEXT_PUBLIC_PROVIDER_LISTNAME || 'Product';
var category: any = [];
const _fetchPolicy: FetchPolicy = 'no-cache'; //'network-only',

const initCategory = async (depth = 0) => {
  let cat = [],
    r: any = undefined;
  try {
    r = await GetBrowseNodes({ ID: '', columns: 'cid, name', depth });
  } catch {}
  if (r) {
    cat = [{ cid: '', name: 'All Categories' }].concat(r);
  }
  return cat;
};

const _category = (depth?: number): Promise<any[]> => {
  if (lfs?.client && (!category || category?.length === 0)) {
    initCategory(depth).then((r) => {
      category = r;
    });
  }
  return category;
};

function Sorting() {
  return [
    { label: t('BestMatch'), value: '' },
    { label: t('LowestPriceShipping'), value: '{"price.value": 1}' },
    { label: t('HighestPriceShipping'), value: '{"price.value": -1}' },
    { label: t('EndingSoonest'), value: '{"expired": 1}' },
    { label: t('NewlyListed'), value: '{"createdAt": -1}' },
  ];
}

const defaultFilters = () => {
  return {
    availability: { $in: ['IN_STOCK', 'BACK_ORDER'] },
  };
};

const filterOptions = () => {
  return [
    {
      name: 'categoryId',
      type: 'select',
      text: t('Categories'),
      choices: category.map((item) => ({
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
    /*
    {
      name: 'color',
      type: 'multiselect',
      text: t('color'),
      choices: [
        { value: 'None', label: t('None') },
        { value: 'Black', label: t('Black') },
        { value: 'Blue', label: t('Blue') },
        { value: 'Brown', label: t('Brown') },
        { value: 'Gray', label: t('Gray') },
        { value: 'Green', label: t('Green') },
        { value: 'Red', label: t('Red') },
        { value: 'White', label: t('White') },
        { value: 'Ivory', label: t('Ivory') },
        { value: 'Beige', label: t('Beige') },
        { value: 'Orange', label: t('Orange') },
        { value: 'Pink', label: t('Pink') },
        { value: 'Purple', label: t('Purple') },
        { value: 'Yellow', label: t('Yellow') },
        { value: 'Silver', label: t('Silver') },
        { value: 'Gold', label: t('Gold') },
        { value: 'Clear', label: t('Clear') },
        { value: 'Multi', label: t('Multi') },
      ],
      default: [],
    }, // */
  ];
};

const getQuery = async (listname) => {
  let query = '';
  try {
    const fieldsSchema = await lfs.getFieldSchemasForForm(listname);
    query = lfs.listQuery(listname, fieldsSchema);
  } catch {}
  return query;
};

const validateSettings = (): boolean => {
  if (!lfs) {
    return false;
  }
  return true;
};

const getFields = async (listname: string): Promise<any[]> => {
  const fieldsSchema = await lfs.getFieldSchemasForForm(listname);
  const fields = fieldsSchema
    .filter(
      (field) =>
        !!field.FieldType &&
        field.FieldType !== 'Object' &&
        field.InternalName.indexOf('.createdAt') < 0 &&
        field.InternalName.indexOf('.updatedAt') < 0
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
          return !dat?.uri ? '' : dat.uri;
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
      } else if (field.InternalName.includes('.')) {
        f['getCellValue'] = (row) => {
          const dat = field.InternalName.split('.').reduce(
            (d, f) => (!d[f] ? d : d[f]),
            row
          );
          return !dat || typeof dat === 'object' ? '--' : dat;
        };
      }

      return f;
    });

  return fields;
};

const GetItem = async (param: IProviderBase): Promise<any> => {
  let { ID, columns, listname } = param;
  listname = listname || _listname;
  let r: any = false;

  try {
    r = await lfs.client.query({
      query: gql`query Get${listname}($_id: ObjectId!){
          get${listname}(_id: $_id) {
            ${!columns ? _columns : columns}
          }
        }`,
      variables: { _id: ID },
      fetchPolicy: _fetchPolicy,
    });
  } catch (e) {
    onError(e);
  }

  if (r) {
    if (r.data) return Promise.resolve(r.data[`get${listname}`]);
    else return Promise.resolve(r);
  } else {
    return Promise.resolve({});
  }
};

const GetItems = async (
  param: IProviderItems,
  options?: string
): Promise<any> => {
  let { Ids, columns, listname } = param;
  listname = listname || _listname;
  let r: any = false;
  if (typeof Ids === 'undefined') {
    return Promise.resolve([]);
  }

  try {
    r = await lfs.client.query({
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
      fetchPolicy: _fetchPolicy,
    });
  } catch (e) {
    onError(e);
  }

  if (r) {
    if (r.data) return Promise.resolve(r.data[`getAll${listname}`]);
    else return Promise.resolve(r);
  } else {
    return Promise.resolve([]);
  }
};

const GetBrowseNodes = async (param: IProviderBase): Promise<any> => {
  let { ID, columns, depth } = param;
  const listname = 'Category';
  let r: any = false;
  try {
    r = await lfs.client.query({
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
      fetchPolicy: _fetchPolicy,
    });
  } catch (e) {
    onError(e);
  }
  if (r && r.data) {
    return Promise.resolve(r.data[`getChild${listname}`]);
  } else {
    return Promise.resolve([]);
  }
};
//_category();

const GetVariations = async (param: IProviderBase): Promise<any> => {
  let { ID, columns, listname = 'Itemgroup' } = param;

  let r: any = false;

  //r = await lfs.itemById(listname, ID);

  try {
    r = await lfs.client.query({
      query: gql`query Get${listname}($_id: ObjectId!){
          get${listname}(_id: $_id) {
            ${
              !columns
                ? `_id,
              article,
              items {${_columns}},
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
      fetchPolicy: _fetchPolicy,
    });
  } catch (e) {
    onError(e);
  }

  if (r) {
    if (r.data) return Promise.resolve(r.data[`get${listname}`]);
    else return Promise.resolve(r);
  } else {
    return Promise.resolve({
      items: [],
    });
  }
};

const readListData = async (stat: IListBaseState): Promise<any> => {
  let {
    sorting,
    pageSize,
    currentPage,
    total,
    search,
    listname,
    fetchPolicy = _fetchPolicy,
  } = stat;
  search = typeof search !== 'undefined' ? search.trim() : undefined;
  let filter =
    typeof stat.filter === 'object' ? { ...stat.filter } : stat.filter;

  const emptyResult = {
    itemSummaries: [],
    total: 0,
    next: false,
    offset: 0,
    limit: 0,
  };

  if (listname === _listname && typeof search === 'undefined') {
    return Promise.resolve(emptyResult);
  }

  if (listname === 'Product' && filter) {
    try {
      filter = typeof filter === 'object' ? filter : JSON.parse(filter || '{}');
    } catch {
      filter = {};
    }
    let minPrice = '',
      maxPrice = '';
    if (filter.hasOwnProperty('MinPrice')) {
      minPrice = filter['MinPrice'];
      delete filter['MinPrice'];
    }
    if (filter.hasOwnProperty('MaxPrice')) {
      maxPrice = filter['MaxPrice'];
      delete filter['MaxPrice'];
    }
    if (minPrice && maxPrice) {
      filter['price.value'] = { $gte: minPrice, $lte: maxPrice };
    } else if (maxPrice) {
      filter['price.value'] = { $lte: maxPrice };
    } else if (minPrice) {
      filter['price.value'] = { $gte: minPrice };
    }

    if (
      filter.hasOwnProperty('categoryId') &&
      ['string', 'number'].includes(typeof filter.categoryId)
    ) {
      if (filter.categoryId) {
        let cats: any[] = [];
        try {
          cats = await GetBrowseNodes({
            ID: filter['categoryId']?.toString(),
            columns: 'cid, name',
            depth: 3,
          });
        } catch {}
        filter['categoryId'] = {
          $in: cats.map((c) => parseInt(c?.cid)).filter(Boolean),
        };
      } else {
        delete filter['categoryId'];
      }
    }
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
    listname === _listname && !!_query
      ? _query
      : await getQuery(listname || _listname);
  if (!_query && listname === _listname) {
    _query = query;
  }

  if (!query) {
    return Promise.resolve(emptyResult);
  }
  let r: any = false;
  try {
    r = await lfs.client.query<IPaginatedRes, IPaginatedVar>({
      query: gql`
        ${query}
      `,
      variables: {
        filter: filter as string,
        sort: sorting,
        total: total,
        skip: pageSize * (currentPage > 0 ? currentPage - 1 : 0),
        take: pageSize,
      },
      fetchPolicy: fetchPolicy as FetchPolicy,
      //errorPolicy: 'all',
    });
  } catch (err) {
    //console.warn(err);
    return Promise.resolve(emptyResult);
  }

  if (r && r.data) {
    return Promise.resolve(r.data[`get${getPlural(listname || _listname)}s`]);
  } else {
    onError(r);
    await clientError(r);
    return Promise.resolve(emptyResult);
  }
};

const onError = (e) => {
  //console.warn(e);
};

export const ListProvider: IDataProvider = {
  validateSettings,
  defaultFilters,
  Sorting,
  filterOptions,
  GetItem,
  GetItems,
  GetBrowseNodes,
  GetVariations,
  readListData,
  setQuery,
  category: _category,
  lfs,
};
