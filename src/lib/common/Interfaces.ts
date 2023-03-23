import { Permission, Language, Currency } from 'nuudel-utils';

export interface IWarehouse {
  _id: string;
  name: string;
  primary: boolean;
}

export interface IImage {
  uri: string;
  width?: number;
  height?: number;
}

export interface IPermission {
  listname: string;
  permission: Permission;
}

export interface IPartner {
  //custom?: boolean;
  vehicle?: string;
  section: boolean;
  regular: number;
  express: number;
  warehouseId?: string;
}

export interface ISettings {
  notification: boolean;
  currency: Currency;
  locale: Language;
  _devices?: string[];
}

export interface ICurrentUser {
  _id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  type: string;
  _verifiedEmail: string;
  avatar: IImage;
  permission: IPermission[];
  phone: string;
  mobile: string;
  settings?: ISettings;
  _partner?: IPartner;
}

export interface IAppProps {
  query: any;
  pathname: any;
  user?: ICurrentUser;
  IsDlg?: boolean;
}
