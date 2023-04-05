// Service
import { ListFormService } from './lib/services/ListFormService';
import { IListFormService } from './lib/services/IListFormService';
import { ListProvider } from './lib/common/ListProvider';
import { GetSchema } from './lib/services/graphqlSchema';
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
  ReduxProps,
} from './lib/common/Interfaces';

import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './lib/common/IListBaseState';

import { createClient } from './lib/hocs/withApollo';

// Core
export {
  withRedux,
  withApollo,
  withContext,
  withUser,
  useAuth,
  Context,
  initStore,
  store,
  QUERY,
  typeDefs,
  resolvers,
  reducer,
} from './lib/hocs';
export {
  ListFormService,
  GetSchema,
  UI,
  coreComponent,
  DataProvider,
  ListProvider,
  createClient,
};

//forms
export * from './lib/forms/';

//library
export * from './lib/library/';

//widgets
export * from './lib/widgets/';

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
  ReduxProps,
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
