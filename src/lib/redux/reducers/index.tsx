import { combineReducers, Reducer } from 'redux';
import fieldsReducer from './Fields';
import userReducer, { IUserProps } from './User';
//import layout from '../../modules/layout/reducer';
//import cart from '../../modules/cart/reducer';

export interface IRootState {
  fields: any;
  user: IUserProps;
  //  layout: any;
  //  cart: any;
}

export interface IRootAction {
  type: string;
  payload: any;
}

const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  fields: fieldsReducer,
  user: userReducer,
  //  layout,
  //  cart,
});

export default rootReducer;
