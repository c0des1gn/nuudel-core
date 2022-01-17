import { ICoreProps } from '../../common/ICoreProps';
import { Permission } from '../../common/ControlMode';

export interface IFormProps extends ICoreProps {
  permission: Permission;
  IsDlg?: boolean | string;
}
