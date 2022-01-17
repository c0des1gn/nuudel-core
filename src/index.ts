// Service
import { ListFormService } from './lib/services/ListFormService';
import { IListFormService } from './lib/services/IListFormService';
import { GetSchema } from './lib/services/graphqlSchema';
import DetailForm from './lib/forms/DetailForm/DetailForm';
import { UI } from './lib/common/UI';
import { coreComponent } from './lib/common/coreComponent';
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
  ControlMode,
  ScreenType,
  DisplayType,
  QueryType,
  MarketType,
  UserRole,
  Permission,
  Language,
  IDeliveryType,
} from './lib/common/ControlMode';

// Core
import {
  withRedux,
  withApollo,
  withContext,
  Context,
  initStore,
} from './lib/hocs/index';
export {
  withRedux,
  withApollo,
  withContext,
  Context,
  initStore,
  ListFormService,
  GetSchema,
  DetailForm,
  UI,
  coreComponent,
  DataProvider,
};

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
  ControlMode,
  ScreenType,
  DisplayType,
  QueryType,
  MarketType,
  UserRole,
  Permission,
  Language,
  IDeliveryType,
};

//@Utils
export * from './lib/common/Utils';
