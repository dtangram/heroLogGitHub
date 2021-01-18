import createReducer from '../helpers/createReducer';

import {
  REQ_EMAILPASSWORDRESET_PENDING,
  REQ_EMAILPASSWORDRESET_SUCCESS,
  REQ_EMAILPASSWORDRESET_ERROR,
} from '../actionTypes';

const initialState = {
  id: null,
  // will hold each passwordreset with ids as keys
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

function emailPasswordresetPending(state, action) {
  // set loading state and clear error

  return {
    ...state,
    isLoading: true,
    error: null,
    // byId: {
    //   ...state.byId,
    //   [action.payload.id]: {
    //     ...state.byId[action.payload.id],
    //     isLoading: true,
    //     error: null,
    //   },
    // },
  };
}

function emailPasswordresetSuccess(state, action) {
  // clear loading and error, update cache time, add passwordresets
  return {
    ...state,
    id: action.data.id,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        isLoading: false,
        error: null,
        loadedAt: Date.now(),
        data: action.data,
      },
    },
    allIds: [...new Set([...state.allIds, action.payload.id])],
  };
}

function emailPasswordresetError(state, action) {
  // clear loading and set error
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        isLoading: false,
        error: action.err,
      },
    },
  };
}

export default createReducer(initialState, {
  [REQ_EMAILPASSWORDRESET_PENDING]: emailPasswordresetPending,
  [REQ_EMAILPASSWORDRESET_SUCCESS]: emailPasswordresetSuccess,
  [REQ_EMAILPASSWORDRESET_ERROR]: emailPasswordresetError,
});
