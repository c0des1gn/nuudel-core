import React, { ComponentType, useState, useRef } from 'react';

// Declaring the state object globally.
let initialState = {
  sort: '',
  view: 'List',
  editContext: (props: any) => {},
};

// Create a context for a user
export const Context = React.createContext(initialState);
Context.displayName = 'mainContext';

const withContext = (WrappedComponent: ComponentType | any) => (props: any) => {
  const [context, setContext] = useState(initialState);
  const contextRef = useRef(context);

  const editContext = val => {
    val = { ...contextRef.current, ...val, editContext };
    contextRef.current = val;
    setContext(val);
  };

  return (
    <Context.Provider
      value={{
        ...contextRef.current,
        editContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  );
};

export default withContext;
