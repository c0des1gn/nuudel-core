import React, { ComponentType } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store/';
import { sign_in, updateProp } from '../../redux/actions/user';
import { initialState } from '../../redux/reducers/User';
import { USER_TOKEN, tokenObj } from 'nuudel-utils';
import { I8, changeLanguage } from '../../loc/i18n';
import UI from '../../common/UI';
import { Language } from 'nuudel-utils';

export const store = createStore();

export const initStore = async (lfs, user: any = undefined) => {
  const state = store.getState();
  if (typeof state.user === 'undefined' || !state.user.token) {
    const token = UI.getItem(USER_TOKEN);
    const userId: string | null = tokenObj(token)?._id || null;
    if (userId !== null) {
      let usr: any = state.user || initialState;
      if (userId) {
        if (!user) {
          user = await lfs.itemById('User', userId);
        }
        usr = {
          ...usr,
          type: user.type || 'Guest',
          currency: !user.settings ? 'MNT' : user.settings.currency,
          locale: !user.settings ? 'mn-MN' : user.settings.locale,
          status: user._status || 'Active',
        };
      }
      const locale = !usr.locale ? 'mn-MN' : Language[usr.locale];
      if (I8.language !== locale) {
        changeLanguage(locale);
      }
      store.dispatch(
        sign_in({
          userId: userId,
          currency: usr.currency,
          locale: Language[usr.locale],
          token: token,
          type: usr.type,
          status: usr.status,
        })
      );
    } else if (typeof state.user === 'undefined') {
      store.dispatch(
        sign_in({
          userId: userId,
          token: token,
        })
      );
    } else if (!state.user.token) {
      store.dispatch(updateProp('token', token));
    }
  }
};

export const withRedux = (WrappedComponent: ComponentType) => (props: any) =>
  (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );

export default withRedux;
