import createReducer from '../helpers/createReducer';

import {
  REQ_MESSAGINGS_PENDING,
  REQ_MESSAGINGS_SUCCESS,
  REQ_MESSAGINGS_ERROR,
  REQ_MESSAGING_PENDING,
  REQ_MESSAGING_SUCCESS,
  REQ_MESSAGING_ERROR,
  ADD_MESSAGING_PENDING,
  ADD_MESSAGING_SUCCESS,
  ADD_MESSAGING_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each messaging with ids as keys
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

function messagingsPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.userId]: Object.assign({}, state[action.payload.userId], {
      // will hold each comicbooklist with ids as keys
      byId: {},
      // an array of all the ids
      allIds: [],
      // needed for cache state
      loadedAt: 0,
      // tracking if the state is loading
      isLoading: true,
      // any errors loading all the data
      error: null,
    }),
  };
}

function messagingsSuccess(state, action) {
  // clear loading and error, update cache time, add messagings
  const currentState = state[action.payload.userId] || {};
  const currentById = currentState.byId || {};
  const currentAllIds = currentState.allIds || [];

  return {
    ...state,
    [action.payload.userId]: {
      isLoading: false,
      error: null,
      loadedAt: Date.now(),
      byId: {
        ...currentById,
        ...action.data.reduce(
          (messagings, messaging) => ({
            // keep the current object
            ...messagings,
            // add the messaging id as the key and an messaging object for loading
            [messaging.id]: {
              data: messaging,
              isLoading: false,
              loadedAt: Date.now(),
              error: null,
            },
          }),
          {},
        ),
      },
      allIds: [...new Set([...currentAllIds, ...action.data.map(messaging => messaging.id)])],
    },
  };
}

function messagingsError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function messagingPending(state, action) {
  // set loading state and clear error
  let messaging = {};
  if (action.payload.messaging) {
    messaging = Object.assign({}, action.payload.messaging);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: messaging,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function messagingSuccess(state, action) {
  // clear loading and error, update cache time, add messagings
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

function messagingError(state, action) {
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
  [REQ_MESSAGINGS_PENDING]: messagingsPending,
  [REQ_MESSAGINGS_SUCCESS]: messagingsSuccess,
  [REQ_MESSAGINGS_ERROR]: messagingsError,
  [REQ_MESSAGING_PENDING]: messagingPending,
  [REQ_MESSAGING_SUCCESS]: messagingSuccess,
  [REQ_MESSAGING_ERROR]: messagingError,
  [ADD_MESSAGING_PENDING]: messagingPending,
  [ADD_MESSAGING_SUCCESS]: messagingSuccess,
  [ADD_MESSAGING_ERROR]: messagingError,
});
