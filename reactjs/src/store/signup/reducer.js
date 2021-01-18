import createReducer from '../helpers/createReducer';

import {
  REQ_USERS_PENDING,
  REQ_USERS_SUCCESS,
  REQ_USERS_ERROR,
  REQ_USER_PENDING,
  REQ_USER_SUCCESS,
  REQ_USER_ERROR,
  ADD_USER_PENDING,
  ADD_USER_SUCCESS,
  ADD_USER_ERROR,
  UPDATE_USER_PENDING,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  DELETE_USER_PENDING,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each signup with ids as keys
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

function signupsPending(state) {
  // set loading state and clear error
  return {
    ...state,
    isLoading: true,
    error: null,
  };
}

function signupsSuccess(state, action) {
  // clear loading and error, update cache time, add signups
  return {
    ...state,
    isLoading: false,
    error: null,
    loadedAt: Date.now(),
    byId: {
      ...state.byId,
      ...action.data.reduce(
        (signups, signup) => ({
          // keep the current object
          ...signups,
          // add the signup id as the key and an signup object for loading
          [signup.id]: {
            data: signup,
            isLoading: false,
            loadedAt: Date.now(),
            error: null,
          },
        }),
        {},
      ),
    },
    allIds: [...new Set([...state.allIds, ...action.data.map(signup => signup.id)])],
  };
}

function signupsError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function signupPending(state, action) {
  // set loading state and clear error
  let signup = {};
  if (action.payload.signup) {
    signup = Object.assign({}, action.payload.signup);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: signup,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function signupSuccess(state, action) {
  // clear loading and error, update cache time, add signups
  const currentData = state.byId[action.data.id] || {};
  const currentById = state.byId || {};
  const currentAllIds = state.allIds || [];

  return {
    ...state,
    byId: {
      ...currentById,
      [action.data.id]: {
        isLoading: false,
        error: null,
        loadedAt: Date.now(),
        // Merging the name (currentData.data) with its id (action.data) into one object
        data: Object.assign({}, currentData.data, action.data),
        // data: action.data,
      },
    },
    allIds: [...new Set([...currentAllIds, action.data.id])],
  };
}

function signupSuccessUpdate(state, action) {
  const currentData = state.byId[action.payload.id] || {};
  const currentState = state[action.payload.userId] || {};
  const currentById = currentState.byId || {};
  const currentAllIds = currentState.allIds || [];

  return {
    ...state,
    byId: {
      ...currentById,
      [action.payload.id]: {
        isLoading: false,
        error: null,
        loadedAt: Date.now(),
        // Merging the name (currentData.data) with its id (action.data) into one object
        data: Object.assign({}, currentData.data, action.data),
        // data: action.data,
      },
    },
    allIds: [...new Set([...currentAllIds, action.payload.id])],
  };
}

function signupSuccessDelete(state, action) {
  const { id } = action.payload.id;
  const allIds = [...state.allIds];
  const byId = { ...state.byId };

  // remove id from allIds array after this id has been deleted
  const index = allIds.indexOf(id);
  if (index !== -1) {
    allIds.splice(index, 1);
  }

  // remove id related the data from the byId object
  delete byId[id];

  return { ...state, allIds, byId };
}

function signupError(state, action) {
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
  [REQ_USERS_PENDING]: signupsPending,
  [REQ_USERS_SUCCESS]: signupsSuccess,
  [REQ_USERS_ERROR]: signupsError,
  [REQ_USER_PENDING]: signupPending,
  [REQ_USER_SUCCESS]: signupSuccess,
  [REQ_USER_ERROR]: signupError,
  [ADD_USER_PENDING]: signupPending,
  [ADD_USER_SUCCESS]: signupSuccess,
  [ADD_USER_ERROR]: signupError,
  [UPDATE_USER_PENDING]: signupPending,
  [UPDATE_USER_SUCCESS]: signupSuccessUpdate,
  [UPDATE_USER_ERROR]: signupError,
  [DELETE_USER_PENDING]: signupPending,
  [DELETE_USER_SUCCESS]: signupSuccessDelete,
  [DELETE_USER_ERROR]: signupError,
});
