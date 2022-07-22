import {
  useReducer,
  createContext,
  ComponentType,
  useContext,
  useEffect,
} from 'react';
import { reducer } from '../withContext/reducer';
import { UI } from '../../common/UI';
import { fetcher } from '../../services/fetcher';
import { ICurrentUser } from '../../common/Interfaces';
import { currentUserQuery } from './Query';
import { USER_ID, USER_TOKEN, USER_KEY } from 'nuudel-utils';
import useSWR from 'swr';
/*
import Router from 'next/router';
function getRedirectTo() {
  if (typeof window !== 'undefined' && window?.location) {
    return window.location;
  }
  return {};
}// */

// Declaring the state object globally.
var initialState: any = {};

// Create a context for a user
export const UserContext = createContext(initialState);
UserContext.displayName = 'userContext';

export const withUser =
  (WrappedComponent: ComponentType | any) => (props: any) => {
    const token = UI.getItem(USER_TOKEN);
    const userId = UI.getItem(USER_ID);
    const username = UI.getItem(USER_KEY);
    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      _id: userId,
      email: username?.includes('@') ? username : null,
      username: !username?.includes('@') ? username : null,
    });

    const { data: fetchedUser, error } = useSWR<any, any>(
      !token || !!state?.type ? null : currentUserQuery,
      fetcher
    );

    useEffect(() => {
      if (fetchedUser?.data?.currentUser) {
        dispatch(fetchedUser.data.currentUser);
      }
    }, [fetchedUser]);
    /*
    useEffect(() => {
      const redir: any = getRedirectTo();
      if (token && userId) {
      } else {
        Router.replace(
          `/admin/login?r=${redir.pathname + encodeURIComponent(redir.search)}`,
          '/admin/login',
          { shallow: true }
        );
      }
    }, []); // */

    return (
      <UserContext.Provider value={state}>
        <WrappedComponent {...props} dispatch={dispatch} />
      </UserContext.Provider>
    );
  };

export const useAuth = () => useContext(UserContext);
export default withUser;
