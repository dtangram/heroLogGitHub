import createReducer from '../helpers/createReducer';

import {
  REQ_SALE_COMICS_PENDING,
  REQ_SALE_COMICS_SUCCESS,
  REQ_SALE_COMICS_ERROR,
  REQ_SALE_COMIC_PENDING,
  REQ_SALE_COMIC_SUCCESS,
  REQ_SALE_COMIC_ERROR,
  ADD_SALE_COMIC_PENDING,
  ADD_SALE_COMIC_SUCCESS,
  ADD_SALE_COMIC_ERROR,
  UPDATE_SALE_COMIC_PENDING,
  UPDATE_SALE_COMIC_SUCCESS,
  UPDATE_SALE_COMIC_ERROR,
  DELETE_SALE_COMIC_PENDING,
  DELETE_SALE_COMIC_SUCCESS,
  DELETE_SALE_COMIC_ERROR,
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

function salesPending(state, action) {
  // set loading state and clear error
  return {
    ...state,
    [action.payload.userId]: Object.assign({}, state[action.payload.userId], {
      isLoading: true,
      error: null,
    }),
  };
}

function salesSuccess(state, action) {
  // clear loading and error, update cache time, add sales
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
          (sales, sale) => ({
            // keep the current object
            ...sales,
            // add the sale id as the key and an sale object for loading
            [sale.id]: {
              data: sale,
              isLoading: false,
              loadedAt: Date.now(),
              error: null,
            },
          }),
          {},
        ),
      },
      allIds: [...new Set([...currentAllIds, ...action.data.map(sale => sale.id)])],
    },
  };
}

function salesError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: action.err,
  };
}

function salePending(state, action) {
  // set loading state and clear error
  let sale = {};
  if (action.payload.sale) {
    sale = Object.assign({}, action.payload.sale);
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        data: sale,
        ...state.byId[action.payload.id],
        isLoading: true,
        error: null,
      },
    },
  };
}

function saleSuccess(state, action) {
  // clear loading and error, update cache time, add sales
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

function saleSuccessUpdate(state, action) {
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

function saleSuccessDelete(state, action) {
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

function saleError(state, action) {
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
  [REQ_SALE_COMICS_PENDING]: salesPending,
  [REQ_SALE_COMICS_SUCCESS]: salesSuccess,
  [REQ_SALE_COMICS_ERROR]: salesError,
  [REQ_SALE_COMIC_PENDING]: salePending,
  [REQ_SALE_COMIC_SUCCESS]: saleSuccess,
  [REQ_SALE_COMIC_ERROR]: saleError,
  [ADD_SALE_COMIC_PENDING]: salePending,
  [ADD_SALE_COMIC_SUCCESS]: saleSuccess,
  [ADD_SALE_COMIC_ERROR]: saleError,
  [UPDATE_SALE_COMIC_PENDING]: salePending,
  [UPDATE_SALE_COMIC_SUCCESS]: saleSuccessUpdate,
  [UPDATE_SALE_COMIC_ERROR]: saleError,
  [DELETE_SALE_COMIC_PENDING]: salePending,
  [DELETE_SALE_COMIC_SUCCESS]: saleSuccessDelete,
  [DELETE_SALE_COMIC_ERROR]: saleError,
});
