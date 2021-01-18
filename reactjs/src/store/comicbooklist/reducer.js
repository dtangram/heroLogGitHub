import createReducer from '../helpers/createReducer';

import {
  REQ_COMIC_BOOK_TITLES_PENDING,
  REQ_COMIC_BOOK_TITLES_SUCCESS,
  REQ_COMIC_BOOK_TITLES_ERROR,
  REQ_COMIC_BOOK_TITLE_PENDING,
  REQ_COMIC_BOOK_TITLE_SUCCESS,
  REQ_COMIC_BOOK_TITLE_ERROR,
  ADD_COMIC_BOOK_TITLE_PENDING,
  ADD_COMIC_BOOK_TITLE_SUCCESS,
  ADD_COMIC_BOOK_TITLE_ERROR,
  UPDATE_COMIC_BOOK_TITLE_PENDING,
  UPDATE_COMIC_BOOK_TITLE_SUCCESS,
  UPDATE_COMIC_BOOK_TITLE_ERROR,
  DELETE_COMIC_BOOK_TITLE_PENDING,
  DELETE_COMIC_BOOK_TITLE_SUCCESS,
  DELETE_COMIC_BOOK_TITLE_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each comicbooklist with ids as keys
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

function comicbooklistsPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.collpubId]: Object.assign({}, state[action.payload.collpubId], {
      isLoading: true,
      error: null,
    }),
  };
}

function comicbooklistsSuccess(state, action) {
  // clear loading and error, update cache time, add comicbooklists
  const currentState = state[action.payload.collpubId] || {};
  const currentById = currentState.byId || {};
  const currentAllIds = currentState.allIds || [];

  return {
    ...state,
    [action.payload.collpubId]: {
      isLoading: false,
      error: null,
      loadedAt: Date.now(),
      byId: {
        ...currentById,
        ...action.data.reduce(
          (comicbooklists, comicbooklist) => ({
            // keep the current object
            ...comicbooklists,
            // add the comicbooklist id as the key and an comicbooklist object for loading
            [comicbooklist.id]: {
              data: comicbooklist,
              isLoading: false,
              loadedAt: Date.now(),
              error: null,
            },
          }),
          {},
        ),
      },
      allIds: [...new Set([...currentAllIds, ...action.data.map(
        comicbooklist => comicbooklist.id,
      )])],
    },
  };
}

function comicbooklistsError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function comicbooklistPending(state, action) {
  // set loading state and clear error
  let comicbooklist = {};
  if (action.payload.comicbooklist) {
    comicbooklist = Object.assign({}, action.payload.comicbooklist);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: comicbooklist,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function comicbooklistSuccess(state, action) {
  // clear loading and error, update cache time, add comicbooklists
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

function comicbooklistSuccessUpdate(state, action) {
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

function comicbooklistSuccessDelete(state, action) {
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

function comicbooklistError(state, action) {
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
  [REQ_COMIC_BOOK_TITLES_PENDING]: comicbooklistsPending,
  [REQ_COMIC_BOOK_TITLES_SUCCESS]: comicbooklistsSuccess,
  [REQ_COMIC_BOOK_TITLES_ERROR]: comicbooklistsError,
  [REQ_COMIC_BOOK_TITLE_PENDING]: comicbooklistPending,
  [REQ_COMIC_BOOK_TITLE_SUCCESS]: comicbooklistSuccess,
  [REQ_COMIC_BOOK_TITLE_ERROR]: comicbooklistError,
  [ADD_COMIC_BOOK_TITLE_PENDING]: comicbooklistPending,
  [ADD_COMIC_BOOK_TITLE_SUCCESS]: comicbooklistSuccess,
  [ADD_COMIC_BOOK_TITLE_ERROR]: comicbooklistError,
  [UPDATE_COMIC_BOOK_TITLE_PENDING]: comicbooklistPending,
  [UPDATE_COMIC_BOOK_TITLE_SUCCESS]: comicbooklistSuccessUpdate,
  [UPDATE_COMIC_BOOK_TITLE_ERROR]: comicbooklistError,
  [DELETE_COMIC_BOOK_TITLE_PENDING]: comicbooklistPending,
  [DELETE_COMIC_BOOK_TITLE_SUCCESS]: comicbooklistSuccessDelete,
  [DELETE_COMIC_BOOK_TITLE_ERROR]: comicbooklistError,
});
