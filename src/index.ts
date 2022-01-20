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

//@Components
export * from './lib/components/index';
import {
  MessageBarType,
  INotificationMessages,
} from './lib/components/MessageBar';

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
  MessageBarType,
  INotificationMessages,
};
