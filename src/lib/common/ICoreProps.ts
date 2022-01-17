import { ControlMode } from './ControlMode';
import { IFieldConfiguration } from '../controls/IFieldConfiguration';
import { IListFormService } from '../services/IListFormService';

export interface IBaseProps {
  lfs: IListFormService;
  listname: string;
  formType: ControlMode;
  id: string | number;
  Parent?: any;
  children?: any;
  fields?: IFieldConfiguration[];
  showUnsupportedFields?: boolean;
  onSubmitSucceeded?(id: number | string | undefined): void;
  onCancel?(url: string): void;
  onSubmitFailed?(fieldErrors: any): void;
  onUpdateFields?(newFields: IFieldConfiguration[]): void;
}

export interface ICoreProps extends IBaseProps {
  reload?: number;
}
