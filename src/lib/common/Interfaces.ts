import { Permission } from '../common/ControlMode';

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
  vehicle?: string;
  section: boolean;
  regular: number;
  express: number;
  warehouseId?: string;
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
  _partner: IPartner;
}

export interface IAppProps {
  query: any;
  pathname: any;
  user?: ICurrentUser;
  IsDlg?: boolean;
}
