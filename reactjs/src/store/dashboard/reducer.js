import createReducer from '../helpers/createReducer';

import {
  REQ_PUBLISHERS_PENDING,
  REQ_PUBLISHERS_SUCCESS,
  REQ_PUBLISHERS_ERROR,
  REQ_PUBLISHER_PENDING,
  REQ_PUBLISHER_SUCCESS,
  REQ_PUBLISHER_ERROR,
  ADD_PUBLISHER_PENDING,
  ADD_PUBLISHER_SUCCESS,
  ADD_PUBLISHER_ERROR,
  UPDATE_PUBLISHER_PENDING,
  UPDATE_PUBLISHER_SUCCESS,
  UPDATE_PUBLISHER_ERROR,
  DELETE_PUBLISHER_PENDING,
  DELETE_PUBLISHER_SUCCESS,
  DELETE_PUBLISHER_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each publisher with ids as keys
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

function publishersPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    isLoading: true,
    error: null,
  };
}

function publishersSuccess(state, action) {
  // clear loading and error, update cache time, add publishers
  const currentState = state[action.payload.userId] || {};
  const currentById = currentState.byId || {};
  const currentAllIds = currentState.allIds || [];

  return {
    ...state,
    isLoading: false,
    error: null,
    loadedAt: Date.now(),
    byId: {
      ...currentById,
      ...action.data.reduce(
        (publishers, publisher) => ({
          // keep the current object
          ...publishers,
          // add the publisher id as the key and an publisher object for loading
          [publisher.id]: {
            data: publisher,
            isLoading: false,
            loadedAt: Date.now(),
            error: null,
          },
        }),
        {},
      ),
    },
    allIds: [...new Set([...currentAllIds, ...action.data.map(publisher => publisher.id)])],
  };
}

function publishersError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function publisherPending(state, action) {
  // set loading state and clear error
  let publisher = {};
  if (action.payload.publisher) {
    publisher = Object.assign({}, action.payload.publisher);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: publisher,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function publisherSuccess(state, action) {
  // clear loading and error, update cache time, add publishers
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

function publisherSuccessUpdate(state, action) {
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

function publisherSuccessDelete(state, action) {
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

function publisherError(state, action) {
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
  [REQ_PUBLISHERS_PENDING]: publishersPending,
  [REQ_PUBLISHERS_SUCCESS]: publishersSuccess,
  [REQ_PUBLISHERS_ERROR]: publishersError,
  [REQ_PUBLISHER_PENDING]: publisherPending,
  [REQ_PUBLISHER_SUCCESS]: publisherSuccess,
  [REQ_PUBLISHER_ERROR]: publisherError,
  [ADD_PUBLISHER_PENDING]: publisherPending,
  [ADD_PUBLISHER_SUCCESS]: publisherSuccess,
  [ADD_PUBLISHER_ERROR]: publisherError,
  [UPDATE_PUBLISHER_PENDING]: publisherPending,
  [UPDATE_PUBLISHER_SUCCESS]: publisherSuccessUpdate,
  [UPDATE_PUBLISHER_ERROR]: publisherError,
  [DELETE_PUBLISHER_PENDING]: publisherPending,
  [DELETE_PUBLISHER_SUCCESS]: publisherSuccessDelete,
  [DELETE_PUBLISHER_ERROR]: publisherError,
});
