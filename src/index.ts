// Service
import { ListFormService } from './lib/services/ListFormService';
import { IListFormService } from './lib/services/IListFormService';
import { GetSchema } from './lib/services/graphqlSchema';
import DetailForm from './lib/forms/DetailForm/DetailForm';
import Forms from './lib/forms/Forms';
import { UI } from './lib/common/UI';
import {
  coreComponent,
  IBaseState,
  ICoreState,
  IDisplayType,
} from './lib/common/coreComponent';
import { IBaseProps, ICoreProps } from './lib/common/ICoreProps';
import IDataProvider from './lib/common/IDataProvider';
import DataProvider from './lib/common/DataProvider';
import {
  IWarehouse,
  IImage,
  IPermission,
  IPartner,
  ICurrentUser,
  IAppProps,
} from './lib/common/Interfaces';

import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './lib/common/IListBaseState';

import { createClient } from './lib/hocs/withApollo';

// Core
import {
  withRedux,
  withApollo,
  withContext,
  withReducer,
  Context,
  initStore,
  store,
  QUERY,
  typeDefs,
  resolvers,
} from './lib/hocs';
export {
  withRedux,
  withApollo,
  withContext,
  withReducer,
  Context,
  initStore,
  store,
  QUERY,
  typeDefs,
  resolvers,
  ListFormService,
  GetSchema,
  DetailForm,
  Forms,
  UI,
  coreComponent,
  DataProvider,
  createClient,
};

//@Components
export * from './lib/components/index';

/**
 * Types exported by 'components/base'
 */
export type {
  IListFormService,
  IWarehouse,
  IImage,
  IPermission,
  IPartner,
  ICurrentUser,
  IAppProps,
  IDataProvider,
  IBaseState,
  ICoreState,
  IDisplayType,
  IBaseProps,
  ICoreProps,
  IListBaseState,
  IProviderBase,
  IProviderItems,
};

// Components
export * from './lib/components/index';

// heplers
export * from './lib/common/helper';

// UI
export * from './lib/common/UI';

// graphql schema
export * from './lib/services/graphqlSchema';

// redux store
export * from './lib/redux/store';
export * from './lib/redux/reduxCore';
export * from './lib/redux/actions/user';

export { compose } from 'redux';
export type { Dispatch } from 'redux';
export { connect } from 'react-redux';
