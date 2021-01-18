import createReducer from '../helpers/createReducer';

import {
  REQ_COMIC_BOOKS_PENDING,
  REQ_COMIC_BOOKS_SUCCESS,
  REQ_COMIC_BOOKS_ERROR,
  REQ_COMIC_BOOK_PENDING,
  REQ_COMIC_BOOK_SUCCESS,
  REQ_COMIC_BOOK_ERROR,
  ADD_COMIC_BOOK_PENDING,
  ADD_COMIC_BOOK_SUCCESS,
  ADD_COMIC_BOOK_ERROR,
  UPDATE_COMIC_BOOK_PENDING,
  UPDATE_COMIC_BOOK_SUCCESS,
  UPDATE_COMIC_BOOK_ERROR,
  DELETE_COMIC_BOOK_PENDING,
  DELETE_COMIC_BOOK_SUCCESS,
  DELETE_COMIC_BOOK_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each comicbooklistissue with ids as keys
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

function comicbooklistissuesPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.titleID]: Object.assign({}, state[action.payload.titleID], {
      isLoading: true,
      error: null,
    }),
  };
}

function comicbooklistissuesSuccess(state, action) {
  // clear loading and error, update cache time, add comicbooklistissues
  const currentState = state[action.payload.titleID] || {};
  const currentById = currentState.byId || {};
  const currentAllIds = currentState.allIds || [];

  return {
    ...state,
    [action.payload.titleID]: {
      isLoading: false,
      error: null,
      loadedAt: Date.now(),
      byId: {
        ...currentById,
        ...action.data.reduce(
          (comicbooklistissues, comicbooklistissue) => ({
            // keep the current object
            ...comicbooklistissues,
            // add the comicbooklistissue id as the key and an comicbooklistissue object for loading
            [comicbooklistissue.id]: {
              data: comicbooklistissue,
              isLoading: false,
              loadedAt: Date.now(),
              error: null,
            },
          }),
          {},
        ),
      },
      allIds: [...new Set([...currentAllIds, ...action.data.map(
        comicbooklistissue => comicbooklistissue.id,
      )])],
    },
  };
}

function comicbooklistissuesError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function comicbooklistissuePending(state, action) {
  // set loading state and clear error
  let comicbooklistissue = {};
  if (action.payload.comicbooklistissue) {
    comicbooklistissue = Object.assign({}, action.payload.comicbooklistissue);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: comicbooklistissue,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function comicbooklistissueSuccess(state, action) {
  // clear loading and error, update cache time, add comicbooklistissues
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

function comicbooklistissueSuccessUpdate(state, action) {
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

function comicbooklistissueSuccessDelete(state, action) {
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

function comicbooklistissueError(state, action) {
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
  [REQ_COMIC_BOOKS_PENDING]: comicbooklistissuesPending,
  [REQ_COMIC_BOOKS_SUCCESS]: comicbooklistissuesSuccess,
  [REQ_COMIC_BOOKS_ERROR]: comicbooklistissuesError,
  [REQ_COMIC_BOOK_PENDING]: comicbooklistissuePending,
  [REQ_COMIC_BOOK_SUCCESS]: comicbooklistissueSuccess,
  [REQ_COMIC_BOOK_ERROR]: comicbooklistissueError,
  [ADD_COMIC_BOOK_PENDING]: comicbooklistissuePending,
  [ADD_COMIC_BOOK_SUCCESS]: comicbooklistissueSuccess,
  [ADD_COMIC_BOOK_ERROR]: comicbooklistissueError,
  [UPDATE_COMIC_BOOK_PENDING]: comicbooklistissuePending,
  [UPDATE_COMIC_BOOK_SUCCESS]: comicbooklistissueSuccessUpdate,
  [UPDATE_COMIC_BOOK_ERROR]: comicbooklistissueError,
  [DELETE_COMIC_BOOK_PENDING]: comicbooklistissuePending,
  [DELETE_COMIC_BOOK_SUCCESS]: comicbooklistissueSuccessDelete,
  [DELETE_COMIC_BOOK_ERROR]: comicbooklistissueError,
});
