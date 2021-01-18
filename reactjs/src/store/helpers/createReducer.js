// function that takes the initial state and different handlers
export default function createReducer(initialState, handlers) {
  // returns reducer function that is called for each dispatch with state and action
  return function reducer(state = initialState, action) {
    // if the handlers define this action type
    if (handlers[action.type]) {
      // return the state of the function linked to that handler
      return handlers[action.type](state, action);
    }
    return state;
  };
}
