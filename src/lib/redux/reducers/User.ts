import * as CONST from '../constants';
import { IRootState, IRootAction } from './index';
import { MarketType, Theme } from 'nuudel-utils';

export const initialState: IUserProps = {
  userId: '',
  token: '',
  currency: 'MNT',
  locale: 'mn-MN',
  type: 'Guest',
  filters: {},
  market: MarketType.Ebay,
  theme: 'light',
  status: 'Active',
};
export interface IUserProps {
  userId: string;
  currency: string;
  locale: string;
  token: string;
  type: string;
  filters: any;
  market: MarketType;
  theme: Theme;
  status: string;
}

const user = (state = initialState, action: IRootAction) => {
  switch (action.type) {
    case CONST.SIGNOUT:
      return initialState;
    case CONST.SIGNIN:
      return {
        ...initialState,
        ...action.payload.obj,
      };
    case CONST.UPDATE_PROP:
      return {
        ...state,
        ...{ [action.payload.prop]: action.payload.value },
      };
    default:
      return state;
  }
};

export default user;
