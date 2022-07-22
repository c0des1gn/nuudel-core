export const reducer = (state, action): any => {
  if (action.type === 'set' && action.payload?.prop) {
    if (action.payload.key) {
      state = {
        ...state,
        [action.payload.prop]: {
          ...state[action.payload.prop],
          [action.payload.key]: action.payload.value,
        },
      };
    } else {
      state = {
        ...state,
        [action.payload.prop]: {
          ...state[action.payload.prop],
          ...action.payload.value,
        },
      };
    }
  } else if (action.type === 'set') {
    if (action.payload?.key) {
      state = {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    } else {
      state = {
        ...action.payload?.value,
      };
    }
  } else if (action.type === 'remove' && action.payload?.key) {
    delete state[action.payload.key];
  } else if (action.type === 'reset') {
    state = {}; // {...initialState}
  } else if (typeof action === 'object' && (!action.type || !!action._id)) {
    // assign
    state = {
      ...state,
      ...action,
    };
  }
  return state;
};
