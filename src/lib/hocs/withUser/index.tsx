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
import { USER_TOKEN, tokenObj } from 'nuudel-utils';
import useSWR from 'swr';
//*
import Router from 'next/router';
function getRedirectTo() {
  if (typeof window !== 'undefined' && window?.location) {
    return window.location;
  }
  return {};
} // */

// Declaring the state object globally.
var initialState: any = {};

// Create a context for a user
export const UserContext = createContext(initialState);
UserContext.displayName = 'userContext';

export const withUser =
  (WrappedComponent: ComponentType | any) => (props: any) => {
    let token = UI.getItem(USER_TOKEN);
    let cuser: any = { _id: null, username: null, email: null };
    const obj = tokenObj(token);
    if (obj?._id && obj?.exp > Math.ceil(Date.now() / 1000)) {
      cuser = {
        _id: obj._id,
        username: obj.username,
        email: obj.email,
        //type: obj.type, // security эрсдэлтэй тул тайлбар болгов
      };
    }

    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      ...cuser,
    });

    const { data: fetchedUser, error } = useSWR<any, any>(
      !token || !!state?.type ? null : currentUserQuery,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        loadingTimeout: 10000,
        focusThrottleInterval: 0,
        dedupingInterval: 10000,
        errorRetryInterval: 10000,
        errorRetryCount: 1,
        shouldRetryOnError: false,
      }
    );

    if (token && error && error.message?.includes('not logged')) {
      const redir: any = getRedirectTo();
      try {
        Router.replace(
          `/admin/login?r=${redir.pathname + encodeURIComponent(redir.search)}`,
          '/admin/login'
        );
      } catch {}
    }

    useEffect(() => {
      if (fetchedUser?.data?.currentUser) {
        dispatch(fetchedUser.data.currentUser);
      }
    }, [fetchedUser]);

    return (
      <UserContext.Provider value={state}>
        <WrappedComponent {...props} dispatch={dispatch} />
      </UserContext.Provider>
    );
  };

export const useAuth = () => useContext(UserContext);
export default withUser;
