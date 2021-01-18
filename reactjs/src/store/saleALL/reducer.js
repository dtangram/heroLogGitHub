import createReducer from '../helpers/createReducer';

import {
  REQ_SALE_ALL_COMICS_PENDING,
  REQ_SALE_ALL_COMICS_SUCCESS,
  REQ_SALE_ALL_COMICS_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each sale with ids as keys
  byId: {},
  // an array of all the ids
  allIds: [],
  // needed for cache state
  loadedAt: 0,
  // tracking if the state is loading
  isLoading: false,
  // any errors loading all the data
  error: null,
};

function salesALLPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.userId]: Object.assign({}, state[action.payload.userId], {
      isLoading: true,
      error: null,
    }),
  };
}

function salesALLSuccess(state, action) {
  // clear loading and error, update cache time, add sales
  return {
    ...state,
    isLoading: false,
    error: null,
    loadedAt: Date.now(),
    byId: {
      ...state.byId,
      ...action.data.reduce(
        (salesALL, allsale) => ({
          // keep the current object
          ...salesALL,
          // add the sale id as the key and an sale object for loading
          [allsale.id]: {
            data: allsale,
            isLoading: false,
            loadedAt: Date.now(),
            error: null,
          },
        }),
        {},
      ),
    },
    allIds: [...new Set([...state.allIds, ...action.data.map(allsale => allsale.id)])],
  };
}

function salesALLError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

export default createReducer(initialState, {
  [REQ_SALE_ALL_COMICS_PENDING]: salesALLPending,
  [REQ_SALE_ALL_COMICS_SUCCESS]: salesALLSuccess,
  [REQ_SALE_ALL_COMICS_ERROR]: salesALLError,
});
