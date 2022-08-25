import React, { useReducer, createContext, ComponentType } from 'react';
import { ViewMode } from 'nuudel-utils';
import { reducer } from './reducer';

// Declaring the state object globally.
var initialState: any = {
  sort: '',
  view: ViewMode.List,
  theme: 'light',
  //filters: {},
};

// Create a context for a user
export const Context = createContext(initialState);
Context.displayName = 'mainContext';

export const withContext =
  (WrappedComponent: ComponentType | any) => (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <Context.Provider value={state}>
        <WrappedComponent {...props} disPatch={dispatch} />
      </Context.Provider>
    );
  };

export default withContext;
