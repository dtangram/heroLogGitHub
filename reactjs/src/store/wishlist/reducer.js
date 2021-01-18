import createReducer from '../helpers/createReducer';

import {
  REQ_WISHLIST_COMICS_PENDING,
  REQ_WISHLIST_COMICS_SUCCESS,
  REQ_WISHLIST_COMICS_ERROR,
  REQ_WISHLIST_COMIC_PENDING,
  REQ_WISHLIST_COMIC_SUCCESS,
  REQ_WISHLIST_COMIC_ERROR,
  ADD_WISHLIST_COMIC_PENDING,
  ADD_WISHLIST_COMIC_SUCCESS,
  ADD_WISHLIST_COMIC_ERROR,
  UPDATE_WISHLIST_COMIC_PENDING,
  UPDATE_WISHLIST_COMIC_SUCCESS,
  UPDATE_WISHLIST_COMIC_ERROR,
  DELETE_WISHLIST_COMIC_PENDING,
  DELETE_WISHLIST_COMIC_SUCCESS,
  DELETE_WISHLIST_COMIC_ERROR,
} from '../actionTypes';

const initialState = {
  // will hold each wishlist with ids as keys
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

function wishlistsPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.userId]: Object.assign({}, state[action.payload.userId], {
      isLoading: true,
      error: null,
    }),
  };
}

function wishlistsSuccess(state, action) {
  // clear loading and error, update cache time, add wishlists
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
          (wishlists, wishlist) => ({
            // keep the current object
            ...wishlists,
            // add the wishlist id as the key and an wishlist object for loading
            [wishlist.id]: {
              data: wishlist,
              isLoading: false,
              loadedAt: Date.now(),
              error: null,
            },
          }),
          {},
        ),
      },
      allIds: [...new Set([...currentAllIds, ...action.data.map(wishlist => wishlist.id)])],
    },
  };
}

function wishlistsError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function wishlistPending(state, action) {
  // set loading state and clear error
  let wishlist = {};
  if (action.payload.wishlist) {
    wishlist = Object.assign({}, action.payload.wishlist);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: wishlist,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function wishlistSuccess(state, action) {
  // clear loading and error, update cache time, add wishlists
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

function wishlistSuccessUpdate(state, action) {
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

function wishlistSuccessDelete(state, action) {
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

function wishlistError(state, action) {
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
  [REQ_WISHLIST_COMICS_PENDING]: wishlistsPending,
  [REQ_WISHLIST_COMICS_SUCCESS]: wishlistsSuccess,
  [REQ_WISHLIST_COMICS_ERROR]: wishlistsError,
  [REQ_WISHLIST_COMIC_PENDING]: wishlistPending,
  [REQ_WISHLIST_COMIC_SUCCESS]: wishlistSuccess,
  [REQ_WISHLIST_COMIC_ERROR]: wishlistError,
  [ADD_WISHLIST_COMIC_PENDING]: wishlistPending,
  [ADD_WISHLIST_COMIC_SUCCESS]: wishlistSuccess,
  [ADD_WISHLIST_COMIC_ERROR]: wishlistError,
  [UPDATE_WISHLIST_COMIC_PENDING]: wishlistPending,
  [UPDATE_WISHLIST_COMIC_SUCCESS]: wishlistSuccessUpdate,
  [UPDATE_WISHLIST_COMIC_ERROR]: wishlistError,
  [DELETE_WISHLIST_COMIC_PENDING]: wishlistPending,
  [DELETE_WISHLIST_COMIC_SUCCESS]: wishlistSuccessDelete,
  [DELETE_WISHLIST_COMIC_ERROR]: wishlistError,
});
