import React, { ComponentType } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store/';
import { sign_in, updateProp } from '../../redux/actions/user';
import { initialState } from '../../redux/reducers/User';
import { USER_TOKEN, tokenObj } from 'nuudel-utils';
import { I8, changeLanguage } from '../../loc/i18n';
import UI from '../../common/UI';
import { Language, isServer } from 'nuudel-utils';
import { currentUserQuery } from '../../../lib/hocs/withUser/Query';
import { getLanguage } from '../../common/helper';

export const store = createStore();

export const initStore = async (lfs: any, user: any = undefined) => {
  const state = store.getState();
  if (typeof state.user === 'undefined' || !state.user.token) {
    const token = UI.getItem(USER_TOKEN);
    const userId: string | null = tokenObj(token)?._id || null;
    if (userId !== null) {
      let usr: any = state.user || initialState;
      if (userId && !!lfs?.itemById) {
        try {
          if (!user) {
            user = await lfs.itemById('User', userId);
          } else if (!user && token && lfs?.client) {
            const r = await lfs.client.query({
              query: currentUserQuery,
              variables: {},
              fetchPolicy: 'no-cache',
            });
            user = r?.data?.currentUser;
          }
        } catch {}

        usr = {
          ...usr,
          type: user?.type || usr?.type || 'Guest',
          currency:
            (!user?.settings ? usr?.currency : user.settings.currency) || 'MNT',
          locale:
            (!user?.settings ? usr?.locale : user.settings.locale) || 'mn-MN',
          status: user?._status || usr?.status || 'Active',
        };
      }
      const locale = getLanguage(usr?.locale);
      if (!isServer && I8.language !== locale) {
        changeLanguage(locale);
      }
      store.dispatch(
        sign_in({
          userId: userId,
          currency: usr.currency || 'MNT',
          locale: locale,
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
