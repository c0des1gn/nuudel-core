import { ControlMode, QueryType } from '../common/ControlMode';
import { IFieldSchema } from './datatypes/RenderListData';
import { IListFormService } from './IListFormService';
import { ApolloClient, ApolloError } from '@apollo/client';
import gql from 'graphql-tag';
import {
  graphqlSync,
  getIntrospectionQuery,
  IntrospectionQuery,
  GraphQLSchema,
  GraphQLError,
} from 'graphql';
import { fromIntrospectionQuery } from 'graphql-2-json-schema';
import { createClient, URL } from '../hocs/withApollo';
import { GetSchema } from '../services/graphqlSchema';
import {
  onError,
  onErrors,
  traverse,
  clientError,
  getPlural,
  capitalizeFirstLetter,
} from '@Utils';

export interface MutationVariables {
  data: any;
}

export interface MutationResult {
  data?: { [_id: string]: any };
  extensions?: { [_id: string]: any };
  errors?: GraphQLError[];
}

interface Options {
  query: string;
  inputs: object;
}

let client: ApolloClient<any> = createClient();
let schema: GraphQLSchema = null;

/**
 * Gets the schema for all relevant fields for a specified graphQl list form.
 * @param listname The list name of graphql server.
 * @param formType The type of form (Display, New, Edit)
 * @returns Promise object represents the array of field schema for all relevant fields for this list form.
 */
const getFieldSchemasForForm = (
  listname: string,
  formType: ControlMode = ControlMode.Display,
): Promise<IFieldSchema[]> => {
  return new Promise<IFieldSchema[]>(async (resolve, reject) => {
    let schemas: IFieldSchema[] = [];
    let columns: any[] = await get_columns(formType, listname);
    columns.forEach(obj => {
      let Hidden = false,
        DefaultValue: any = null,
        max: number = 0,
        ReadOnlyField = false;
      if (obj.key === '_id') {
        Hidden = true;
        ReadOnlyField = true;
      } else if (
        obj.key.startsWith('_') ||
        obj.key === 'createdAt' ||
        obj.key === 'updatedAt'
      ) {
        Hidden = true;
      }

      if (formType === ControlMode.New) {
        switch (obj.Type) {
          case 'string':
            DefaultValue = '';
            if (obj.FieldType === 'Choice') {
              DefaultValue = null;
            }
            break;
          case 'objectId':
            DefaultValue = null;
            max = 24;
            break;
          case 'boolean':
            DefaultValue = false;
            break;
          case 'number':
            DefaultValue = 0;
            max = 16;
            break;
          case 'array':
            DefaultValue = [];
            break;
          case 'date':
            if (!obj.Required) {
              DefaultValue = new Date();
            }
            break;
          case 'object':
            DefaultValue = null;
            if (obj.FieldType === 'Object') {
              DefaultValue = [];
            }
            break;
          default:
            break;
        }
      }

      schemas.push({
        InternalName: obj.key,
        Title: obj.Title,
        DisplayName: obj.Title,
        Type: obj.Type,
        FieldType: obj.FieldType,
        Required: obj.Required,
        ReadOnlyField: ReadOnlyField,
        Description: obj.Description,
        MaxLength: max > 0 ? max : 255,
        ListName: listname,
        Hidden: Hidden,
        Disable: false,
        DefaultValue: DefaultValue,
        Choices: obj.Choices,
        ChoiceCount: obj.Choices.length,
        keyboardType: obj.keyboardType,
        JsonOption: obj.json,
        ParentObject: obj.ParentObject,
        IsArray: obj.IsArray,
        _Children: obj.Children,
      });
    });
    resolve(schemas);
  });
};

const get_enum = (obj: any) => {
  let choices: any[] = [];
  if (obj.anyOf) {
    obj.anyOf.forEach(item => {
      choices.push({
        id: item.title, //item.title.enum[0]
        name: item.title,
      });
    });
  }
  return choices;
};

const get_columns = async (
  formType: ControlMode,
  listname: string,
  ParentObject = '',
) => {
  let columns: any[] = [];

  if (!schema) {
    try {
      schema = await GetSchema(URL);
    } catch (e) {
      return columns;
    }
  }
  const introspection = graphqlSync(
    schema,
    getIntrospectionQuery(), // introspectionQuery
  ).data as IntrospectionQuery;

  const types: any = fromIntrospectionQuery(introspection, {
    //ignoreInternals: true,
    //nullableArrayItems: true,
  });
  let obj: any = undefined;
  if (formType === ControlMode.Edit) {
    obj =
      types.properties.Mutation.properties['update' + listname]?.properties
        ?.arguments;
  } else if (formType === ControlMode.New) {
    obj = types.definitions[listname + 'Input'];
  } else if (formType === ControlMode.Display) {
    obj = types.definitions[listname];
  } else {
    obj = types.definitions[listname];
  }
  if (!obj) {
    // redirect to not found page when list does not exist
    window.location.href = '/404';
    return columns;
  }
  let fields = obj.properties;
  let flds: string[] = Object.keys(fields);
  for (let i = 0; i < flds.length; i++) {
    let key = flds[i];
    let Type = 'object',
      FieldType = 'Text',
      Description = '',
      Choices: any[] = [],
      Children: any[] = [],
      json: any = undefined,
      IsArray = false,
      keyboardType = 'default',
      Required = false;
    if (
      obj.required &&
      (obj.required instanceof Array || Array.isArray(obj.required))
    ) {
      Required = obj.required.indexOf(key) >= 0;
    }
    if (
      types.definitions[listname] &&
      types.definitions[listname].properties[key] &&
      types.definitions[listname].properties[key].description
    ) {
      Description = types.definitions[listname].properties[key].description;
      let arr: string[] | null = Description.match(/\{[^{}]*\}/gm);
      Description = Description.replace(/\{[^{}]*\}/gm, ''); //remove lookup config from description

      if (arr !== null && arr.length > 0) {
        json = JSON.parse(arr[0].replace(/\'/g, '"'));
      }
    }
    if (fields[key].type) {
      Type = fields[key].type;
      switch (Type) {
        case 'string':
          FieldType = 'Text';
          break;
        case 'boolean':
          FieldType = 'Boolean';
          break;
        case 'number':
          FieldType = 'Number';
          break;
        case 'array':
          FieldType = 'MultiChoice';
          break;
        default:
          break;
      }
    }

    switch (fields[key].$ref) {
      case '#/definitions/String':
        Type = 'string';
        FieldType = 'Text';
        break;
      case '#/definitions/Note':
        Type = 'string';
        FieldType = 'Note';
        break;
      case '#/definitions/ObjectId':
        Type = 'objectId';
        FieldType = !!json && !!json.list ? 'Lookup' : 'Text';
        break;
      case '#/definitions/Float':
        Type = 'number';
        FieldType = 'Number';
        keyboardType = 'decimal-pad';
        break;
      case '#/definitions/Int':
        Type = 'number';
        FieldType = 'Number';
        keyboardType = 'numeric';
        break;
      case '#/definitions/Boolean':
        Type = 'boolean';
        FieldType = 'Boolean';
        break;
      case '#/definitions/DateTime':
        Type = 'date';
        FieldType = 'DateTime';
        break;
      case '#/definitions/Link':
        Type = 'string';
        FieldType = 'Link';
        break;
      case '#/definitions/Lookup':
        Type = 'string';
        FieldType = 'Lookup';
        break;
      case '#/definitions/Image':
      case '#/definitions/ImageInput':
        Type = 'object';
        FieldType = 'Image';
        //let objs: any[] = await get_columns(
        //  ControlMode.Display,
        //  'ImageObj',
        //  key,
        //);
        //columns.push(...objs);
        break;
      default:
        if (fields[key].type === 'array') {
          IsArray = true;
          Type = 'array';
          if (fields[key].items.$ref === '#/definitions/Lookup') {
            FieldType = 'LookupMulti';
          } else if (fields[key].items.$ref.startsWith('#/definitions/Image')) {
            FieldType = 'Image';
          } else if (fields[key].items.$ref.startsWith('#/definitions/')) {
            let enumName: string = types.definitions[listname].properties[
              key
            ].items.$ref.substring(14);
            if ('ObjectId' === enumName) {
              FieldType = !!json && !!json.list ? 'LookupMulti' : 'Text';
            } else if (types.definitions[enumName].type === 'object') {
              Type = 'object';
              FieldType = 'Object';
              Children = await getFieldSchemasForForm(
                enumName,
                ControlMode.Display,
              );
              Children = Children.filter(c => !c.Title.startsWith('_'));
            } else {
              Choices = get_enum(types.definitions[enumName]);
              FieldType = 'MultiChoice';
            }
          }
        } else if (fields[key].$ref.startsWith('#/definitions/')) {
          let enumName: string = fields[key].$ref.substring(14);
          if (types.definitions[enumName].type === 'object') {
            Type = 'object';
            FieldType = '';
            let objs: any[] = await get_columns(
              ControlMode.Display,
              enumName,
              !!ParentObject ? ParentObject + '.' + key : key,
            );
            objs = objs.filter(c => !c.Title.startsWith('_'));
            columns.push(...objs);
          } else {
            Choices = get_enum(types.definitions[enumName]);
            Type = 'string';
            FieldType = 'Choice';
          }
        }
        break;
    }
    columns.push({
      key: !!ParentObject ? ParentObject + '.' + key : key,
      Title: key,
      Type,
      FieldType,
      Required,
      Description,
      keyboardType,
      Choices,
      json,
      ParentObject,
      IsArray,
      Children,
    });
  }

  return columns;
};

/**
 * Retrieves the data for a specified graphQl list form.
 *
 * @param listname The list name of graphql server.
 * @param columns Array of columns.
 * @param client graphql client.
 * @returns Promise representing an object containing all the field values for the list item.
 */
const getDataAll = (
  listname: string,
  columns: string[] | string,
  client,
  variables: any = {},
): Promise<any> => {
  if (!listname || columns.length === 0) {
    return Promise.resolve({}); // no data, so returns empty
  }

  return new Promise<any>(async (resolve, reject) => {
    listname = capitalizeFirstLetter(listname);
    let query = `query GetAllUser($sort: String, $limit: Int, $filter: String){
        getAll${listname} (limit: $limit, filter: $filter, sort: $sort){
          _id,
          ${typeof columns === 'string' ? columns : columns.join(', ')}
        }
      }`;

    let r: any = null;
    try {
      r = await client.query({
        query: gql`
          ${query}
        `,
        variables: { filter: '{}', sort: '{}', limit: 0, ...variables },
        fetchPolicy: 'no-cache',
      });
    } catch (error) {
      return reject(error);
    }

    if (r && r.data) {
      return resolve(r.data[`getAll${listname}`]);
    } else {
      return reject(r.error);
    }
  });
};

const addQuery = (
  listname: string,
  data: any,
  fieldsSchema: IFieldSchema[],
): Options => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return { query: '', inputs: {} };
  }
  let values = GetArrayValues(fieldsSchema, data, {});
  let keys = getSeletorsKey(
    GetJsonValues(
      listname === 'User'
        ? values.filter(v => v.InternalName !== 'password')
        : values,
      true,
    ),
  );

  let inputs: any = ArrayToObj(GetJsonValues(values));
  //.replace(/\{([^\:|\{|\}|]*)\}/g, '[$1]')
  listname = capitalizeFirstLetter(listname);
  let query = `mutation Add${listname}($data: ${listname}Input!) {
      add${listname}(input${listname}: $data) {
        _id,
        ${keys}
      }
    }`;
  return { query, inputs };
};

const editQuery = (
  listname: string,
  itemId: number | string,
  data: any,
  originalData: any,
  fieldsSchema: IFieldSchema[],
) => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return '';
  }
  let values = GetArrayValues(fieldsSchema, data, originalData, true);
  let keys = getSeletorsKey(GetJsonValues(values, true));
  let formValues = GetJsonValues(values);
  formValues.push({ _id: itemId });

  let args: string = JSON.stringify(ArrayToObj(formValues));
  args = args
    .substring(1, args.length - 1)
    .replace(/\\"/g, '\uFFFF')
    .replace(/\"([^"]+)\":/g, '$1:')
    .replace(/\uFFFF/g, '\\"')
    .replace(/\"\{([^\{\}\"]*)\}\"/g, '$1'); // MultiChoice | Choice fix hack;

  listname = capitalizeFirstLetter(listname);
  let query = `mutation {
      update${listname}(${args}) {
        _id
        ,${keys}
      }
    }`;
  return query;
};

const byIdQuery = (
  listname: string,
  itemId: string | number,
  fieldsSchema: IFieldSchema[],
  withQuery: boolean = true,
) => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return '';
  }
  let keys = getSeletorsKey(GetJsonValues(fieldsSchema, true));
  listname = capitalizeFirstLetter(listname);
  let query = `get${listname}(_id: "${itemId}") {
        createdAt,
        updatedAt,
        ${keys}
      }`;
  return !withQuery ? query : `query { ${query} }`;
};

const plural = (listname: string) => {
  if (
    listname.endsWith('s') ||
    listname.endsWith('sh') ||
    listname.endsWith('ch') ||
    listname.endsWith('x') ||
    listname.endsWith('z')
  ) {
    listname += 'e';
  } else if (listname.endsWith('y')) {
    listname = listname.substring(0, listname.length - 1) + 'ie';
  } else if (listname.endsWith('f') || listname.endsWith('fe')) {
    listname =
      listname.substring(
        0,
        listname.length - (listname.endsWith('fe') ? 2 : 1),
      ) + 've';
  }
  return listname;
};

/**
 * Retrieves the data for a specified graphQl list form.
 *
 * @param listname The list name of graphql server.
 * @param fieldsSchema The array of field schema for all relevant fields of this list.
 * @returns Promise representing an object containing all the field values for the list item.
 */
const listQuery = (listname: string, fieldsSchema: IFieldSchema[]): string => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return '';
  }
  listname = capitalizeFirstLetter(listname);

  let keys = getSeletorsKey(GetJsonValues(fieldsSchema, true));

  let query = `query Get${plural(
    listname,
  )}s($filter: String!, $sort: String!, $total: Int!, $skip: Int!, $take: Int!) {
        get${plural(
          listname,
        )}s(filter: $filter, sort: $sort, total: $total, skip: $skip, take: $take) {
          itemSummaries {
            ${keys}
          },
          next,
          limit,
          offset,
          total
        }
      }`;
  return query;
};

/**
 * Retrieves the data for a specified graphQl list form.
 *
 * @param listname The list name of graphql server.
 * @returns Promise representing an object containing query string.
 */
const viewItems = async (
  listname: string,
  variables: any = {},
  fieldsSchema: IFieldSchema[] = [],
): Promise<any> => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    fieldsSchema = await getFieldSchemasForForm(listname, ControlMode.New);
  }

  let query: string = viewQuery(listname, fieldsSchema);
  variables = { filter: '{}', sort: '{}', limit: 0, ...variables }; //Object.assign({filter: '{}', sort: '{}', limit: 0}, variables);
  return executeQuery(query, listname, QueryType.View, variables);
};

const viewQuery = (
  listname: string,
  fieldsSchema: IFieldSchema[],
  withQuery: boolean = true,
): string => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return '';
  }
  listname = capitalizeFirstLetter(listname);

  if (listname === 'User') {
    fieldsSchema = fieldsSchema.filter(
      item => item.InternalName !== 'password',
    );
  }

  let formValues = GetJsonValues(fieldsSchema, true);
  let keys = getSeletorsKey(formValues);

  let query = `getAll${listname}(filter: $filter, sort: $sort, limit: $limit) {
          _id,
          createdAt,
          updatedAt,
          ${keys}
        }`;

  return withQuery
    ? `query GetAll${listname}($filter: String!, $sort: String!, $limit: Int!) {
      ${query}
    }`
    : query;
};

/**
 * Retrieves the data for a specified graphQl list form.
 *
 * @param listname The list name of graphql server.
 * @param itemId The ID of the list item to be updated.
 * @returns Promise representing an object containing all the field values for the list item.
 */
const itemById = async (
  listname: string,
  itemId: number | string,
  fieldsSchema: IFieldSchema[] = [],
): Promise<any> => {
  if (!listname || !itemId || itemId === '') {
    return Promise.resolve({}); // no data, so returns empty
  }

  if (!fieldsSchema || fieldsSchema.length === 0) {
    fieldsSchema = await getFieldSchemasForForm(listname, ControlMode.Display);
  }
  let query = byIdQuery(listname, itemId, fieldsSchema);
  return executeQuery(query, listname, QueryType.byId);
};

/**
 * Delete a graphQl list item to a list using the given data.
 *
 * @param listname The list name of graphql server.
 * @param itemId An object id of item.
 * @returns Promise object represents the updated or erroneous form field values.
 */
const deleteItem = (
  listname: string,
  itemId: string | number,
): Promise<any> => {
  let mutate = `mutation {
      delete${listname}( 
        _id: "${itemId}"
      ) {
          _id
        }
      }`;
  return executeQuery(mutate, listname, QueryType.Remove);
};

/**
 * Saves the given data to the specified graphQl list item.
 *
 * @param listname The list name of graphql server.
 * @param itemId The ID of the list item to be updated.
 * @param fieldsSchema The array of field schema for all relevant fields of this list.
 * @param data An object containing all the field values to update.
 * @param originalData An object containing all the field values retrieved on loading from list item.
 * @returns Promise object represents the updated or erroneous form field values.
 */
const updateItem = async (
  listname: string,
  itemId: number | string,
  data: any,
  originalData: any = {},
  fieldsSchema: IFieldSchema[] = [],
): Promise<any> => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    fieldsSchema = await getFieldSchemasForForm(listname, ControlMode.Edit);
  }
  let query = editQuery(listname, itemId, data, originalData, fieldsSchema);
  return executeQuery(query, listname, QueryType.Edit);
};

/**
 * Adds a new graphQl list item to a list using the given data.
 *
 * @param listname The list name of graphql server.
 * @param fieldsSchema The array of field schema for all relevant fields of this list.
 * @param data An object containing all the field values to set on creating item.
 * @returns Promise object represents the updated or erroneous form field values.
 */
const createItem = async (
  listname: string,
  data: any,
  fieldsSchema: IFieldSchema[] = [],
): Promise<any> => {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    fieldsSchema = await getFieldSchemasForForm(listname, ControlMode.New);
  }
  let obj: Options = addQuery(listname, data, fieldsSchema);
  return executeQuery(obj.query, listname, QueryType.Add, obj.inputs);
};

const manyResources = async (
  listnames: string[],
  filter: string = '{}',
  sort: string = '{}',
  limit: number = 200,
  userId: string | null = null,
) => {
  let query: string = '';
  let fieldsSchema;
  for (let i = 0; i < listnames.length; i++) {
    fieldsSchema = await getFieldSchemasForForm(
      listnames[i],
      ControlMode.Display,
    );
    query += viewQuery(listnames[i], fieldsSchema, false);
  }

  if (!!userId) {
    fieldsSchema = await getFieldSchemasForForm('User', ControlMode.Display);
    query += byIdQuery('User', userId, fieldsSchema, false);
  }
  query = `query GetLists($filter: String!, $sort: String!, $limit: Int!){${query}}`;
  return executeQuery(query, '', QueryType.Many, {
    filter,
    sort,
    limit,
  });
};

const ArrayToObj = (list: any[]) => {
  let obj: object = {};
  for (let i = 0; i < list.length; i++) {
    if (typeof list[i] === 'object') {
      let keys = Object.keys(list[i]);
      if (keys.length === 1) {
        let data = list[i][keys[0]];
        if (data instanceof Array && data.length > 0) {
          obj[keys[0]] = ArrayToObj(data);
        } else obj[keys[0]] = data;
      } else {
        return list;
      }
    } else {
      return list;
    }
  }
  return obj;
};

const getSeletorsKey = (data: any[]): string => {
  let keys = JSON.stringify(data);
  keys = keys
    .substring(1, keys.length - 1)
    .replace(/\}|\{|\:|\"/g, '')
    .replace(/\]/g, '}')
    .replace(/\[/g, '{');
  return keys;
};

const GetJsonValues = (list: any[], keys: boolean = false): Array<any> => {
  let map = {},
    roots: any[] = [];

  for (let i = 0; i < list.length; i++) {
    map[list[i].InternalName] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (let i = 0; i < list.length; i++) {
    let node: any = list[i];
    const field = {
      [node.Title]:
        node.children.length > 0
          ? node.children
          : keys
          ? node._Children.length > 0
            ? GetJsonValues(node._Children, keys)
            : ''
          : node.value,
    };
    if (!!node.ParentObject) {
      // if parent does not exist
      if (!map.hasOwnProperty(node.ParentObject)) {
        map[node.ParentObject] = list.length;
        list.push({
          InternalName: node.ParentObject,
          Title: node.ParentObject.split('.').pop(),
          value: '',
          _Children: [],
          ParentObject: node.ParentObject.substring(
            0,
            node.ParentObject.lastIndexOf('.'),
          ),
          children: [],
        });
      }
      // if you have dangling branches check that map[node.ParentObject] exists
      list[map[node.ParentObject]].children.push(field);
    } else {
      roots.push(field);
    }
  }
  return roots;
};

const GetArrayValues = (
  fieldsSchema: IFieldSchema[],
  data: any,
  originalData: any,
  IsUpdate = false,
): Array<any> => {
  return fieldsSchema
    .filter(
      field =>
        !field.ReadOnlyField &&
        field.InternalName in data &&
        (data[field.InternalName] !== null ||
          originalData[field.InternalName] !== null),
    )
    .map((field, index, arr) => {
      let val =
        data[field.InternalName] === null &&
        typeof originalData[field.InternalName] !== 'undefined'
          ? originalData[field.InternalName]
          : data[field.InternalName];
      if (IsUpdate) {
        if (field.FieldType === 'MultiChoice' && field.Choices.length > 0) {
          val = '{[' + val.toString() + ']}';
        } else if (field.FieldType === 'Choice') {
          val = '{' + val + '}';
        } else if (
          field.FieldType === 'Object' &&
          field._Children.length > 0 &&
          val instanceof Array &&
          val.length > 0
        ) {
          val = val.map(item => {
            for (let i = 0; i < field._Children.length; i++) {
              if (
                field._Children[i].FieldType === 'MultiChoice' &&
                field._Children[i].Choices.length > 0
              ) {
                if (item.hasOwnProperty(field._Children[i].InternalName)) {
                  item[field._Children[i].InternalName] =
                    '{[' +
                    item[field._Children[i].InternalName].toString() +
                    ']}';
                } else if (
                  field._Children[i].ParentObject &&
                  item.hasOwnProperty(field._Children[i].ParentObject)
                ) {
                  const fldname = field._Children[i].InternalName.replace(
                    field._Children[i].ParentObject + '.',
                    '',
                  );
                  item[field._Children[i].ParentObject][fldname] =
                    '{[' +
                    item[field._Children[i].ParentObject][fldname].toString() +
                    ']}';
                }
              } else if (field._Children[i].FieldType === 'Choice') {
                if (item.hasOwnProperty(field._Children[i].InternalName)) {
                  item[field._Children[i].InternalName] =
                    '{' + item[field._Children[i].InternalName] + '}';
                } else if (
                  field._Children[i].ParentObject &&
                  item.hasOwnProperty(field._Children[i].ParentObject)
                ) {
                  const fldname = field._Children[i].InternalName.replace(
                    field._Children[i].ParentObject + '.',
                    '',
                  );
                  item[field._Children[i].ParentObject][fldname] =
                    '{' + item[field._Children[i].ParentObject][fldname] + '}';
                }
              }
            }
            return item;
          });
        }
      }
      return {
        InternalName: field.InternalName,
        Title: field.Title,
        value: val,
        ParentObject: field.ParentObject,
        _Children: field._Children,
        FieldType: field.FieldType,
      };
    });
};

/**
 * Returns an error message based on the specified error object
 * @param error : An error string/object
 */
const getErrorMessage = (err: any): string => {
  let errorMessage: string = '';
  if (err instanceof ApolloError) {
    errorMessage = onError(err);
  } else {
    errorMessage =
      err.errors && err.errors instanceof Array
        ? err.errors.length > 0 && err.errors[0].message
          ? err.errors[0].message
          : err.errors
        : err;
  }
  //networkError => name, response, statusCode, result
  //console.warn(!err.networkError ? errorMessage : err.networkError.result);
  return errorMessage;
};

/**
 * Returns an void
 * @param listname The list name of graphql server.
 */
const testList = async (listname: string) => {
  let re = { list: listname },
    Id = '';
  try {
    let item = await generateData(listname);
    Id = item._id;
    re['created'] = true;
    await updateItem(listname, Id, traverse(item));
    re['edited'] = true;
    await viewItems(listname, {
      limit: 1,
      filter: `{"_id": "${Id}"}`,
    });
    re['view'] = true;
    await deleteItem(listname, Id);
    re['deleted'] = true;
  } catch (e) {
    console.warn(e);
    if (Id && Object.keys(re).length < 4) {
      await deleteItem(listname, Id);
      re['deleted'] = true;
    }
  }
  return re;
};

/**
 * Returns an void
 * @param listname The list name of graphql server.
 */
const generateData = async (listname: string) => {
  let data: any = {};
  const chars = [...'abcdef0123456789'];
  const fieldsSchema = await getFieldSchemasForForm(listname, ControlMode.New);

  fieldsSchema.forEach(field => {
    let val: any = null;
    switch (field.Type) {
      case 'string':
        val = [...Array(Math.floor(Math.random() * 10 + 4))]
          .map(_ => ((Math.random() * 36) | 0).toString(36))
          .join('');
        if (field.FieldType === 'Choice') {
          if (field.Choices.length > 0)
            val =
              field.Choices[Math.floor(Math.random() * field.Choices.length)]
                .id;
          else val = null;
        } else if (field.FieldType === 'Link') {
          val = 'http://www.' + val + '.com';
        } else if (field.FieldType === 'Image') {
          val = { uri: val };
        }
        break;
      case 'boolean':
        val = Math.random() >= 0.5;
        break;
      case 'number':
        val = Math.floor(Math.random() * 1000);
        break;
      case 'array':
        val = [];
        if (field.FieldType === 'MultiChoice' && field.Choices.length > 0) {
          val = [
            field.Choices[Math.floor(Math.random() * field.Choices.length)].id,
          ];
        } else if (field.FieldType === 'Image') {
          val = [{ uri: '', width: 100, height: 50 }];
        }
        break;
      case 'date':
        val = new Date(Date.now() + 86400000).toLocaleDateString('en-US');
        break;
      case 'object':
        val = null;
        if (field.FieldType === 'Object') {
          val = [];
        } else if (field.FieldType === 'Image') {
          val = { uri: '' };
        }
        break;
      case 'objectId':
        //case 'ObjectId':
        val = [...Array(24)]
          .map(i => chars[(Math.random() * chars.length) | 0])
          .join('');
        break;
      default:
        break;
    }
    data[field.InternalName] = val;
  });
  return createItem(listname, data, fieldsSchema);
};

/**
 * Adds a new graphQl list item to a list using the given data.
 *
 * @param query The query or mutation.
 * @param listname The list name of graphql server.
 * @param type type of the query.
 * @param variables input variables of graphql.
 * @returns Promise object represents the updated or erroneous form field values.
 */
const executeQuery = (
  query: string,
  listname: string,
  type: QueryType | string,
  variables: any = {},
): Promise<any> => {
  if ((!listname && type !== QueryType.Many) || !query) {
    return Promise.resolve(type === QueryType.View ? [] : {}); // no data, so returns empty
  }
  return new Promise<any>(async (resolve, reject) => {
    let r: any = null;
    let pre: string = '',
      post: string = '';

    if (typeof type === 'string') {
      pre = type;
    }
    switch (type) {
      case QueryType.Add:
        pre = 'add';
        break;
      case QueryType.Edit:
        pre = 'update';
        break;
      case QueryType.Remove:
        pre = 'delete';
        break;
      case QueryType.byId:
        pre = 'get';
        break;
      case QueryType.View:
        pre = 'getAll';
        break;
      case QueryType.List:
        pre = 'get';
        post = 's';
        break;
      default:
        break;
    }

    try {
      if (query.startsWith('query')) {
        r = await client.query({
          query: gql`
            ${query}
          `,
          variables: variables,
          fetchPolicy: 'no-cache',
        });
      } else {
        //<MutationResult, MutationVariables>
        r = await client.mutate<any, any>({
          mutation: gql`
            ${query}
          `,
          variables: {
            data: variables,
          },
          fetchPolicy: 'no-cache',
        });
      }
    } catch (error) {
      //console.warn(query);
      onErrors(error);
      return reject(getErrorMessage(error));
    }

    if (r) {
      await clientError(r);
      if (r.data)
        return resolve(
          !listname
            ? r.data
            : r.data[`${pre}${getPlural(listname, post)}${post}`],
        );
      else return resolve(type === QueryType.View ? [] : {});
    } else {
      return reject(getErrorMessage(r));
    }
  });
};

export const ListFormService: IListFormService = {
  client,
  getFieldSchemasForForm,
  itemById,
  createItem,
  updateItem,
  deleteItem,
  viewItems,
  listQuery,
  executeQuery,
  getDataAll,
  generateData,
  manyResources,
};
