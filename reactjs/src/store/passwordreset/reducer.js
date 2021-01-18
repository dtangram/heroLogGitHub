import createReducer from '../helpers/createReducer';

import {
  REQ_PASSWORDRESET_PENDING,
  REQ_PASSWORDRESET_SUCCESS,
  REQ_PASSWORDRESET_ERROR,
  UPDATE_PASSWORDRESET_PENDING,
  UPDATE_PASSWORDRESET_SUCCESS,
  UPDATE_PASSWORDRESET_ERROR,
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

function passwordresetPending(state, action) {
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

function passwordresetSuccess(state, action) {
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

function passwordresetSuccessUpdate(state, action) {
  const currentData = state.byId[action.payload.id] || {};

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        isLoading: false,
        error: null,
        loadedAt: Date.now(),
        // Merging the name (currentData.data) with its id (action.data) into one object
        data: Object.assign({}, currentData.data, action.data),
        // data: action.data,
      },
    },
    allIds: [...new Set([...state.allIds, action.payload.id])],
  };
}

function passwordresetError(state, action) {
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
  [REQ_PASSWORDRESET_PENDING]: passwordresetPending,
  [REQ_PASSWORDRESET_SUCCESS]: passwordresetSuccess,
  [REQ_PASSWORDRESET_ERROR]: passwordresetError,
  [UPDATE_PASSWORDRESET_PENDING]: passwordresetPending,
  [UPDATE_PASSWORDRESET_SUCCESS]: passwordresetSuccessUpdate,
  [UPDATE_PASSWORDRESET_ERROR]: passwordresetError,
});
