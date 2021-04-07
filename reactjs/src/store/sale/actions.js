import uuid from 'uuid/v1';
import API from '../../API';
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

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');

export const fetchSales = () => ({
  // types for this action - "request, success, error"
  types: [REQ_SALE_COMICS_PENDING, REQ_SALE_COMICS_SUCCESS, REQ_SALE_COMICS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/salelist/signups/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.sales;
    // if sales are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the sale or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const createSale = (sale) => {
  // create a uuid for this sale so that we can use it in the reducer for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_SALE_COMIC_PENDING,
      ADD_SALE_COMIC_SUCCESS,
      ADD_SALE_COMIC_ERROR,
    ],
    callAPI: () => API.post('/salelist/', { id, ...sale }),
    payload: { id },
  };
};

export const fetchSale = id => ({
  types: [REQ_SALE_COMIC_PENDING, REQ_SALE_COMIC_SUCCESS, REQ_SALE_COMIC_ERROR],
  callAPI: () => API.get(`/salelist/${id}`),
  shouldCallAPI: (state) => {
    const sale = state.sales.byId[id] || {};
    const { loadedAt, isLoading } = sale;
    if (!sale || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateSale = sale => ({
  types: [
    UPDATE_SALE_COMIC_PENDING,
    UPDATE_SALE_COMIC_SUCCESS,
    UPDATE_SALE_COMIC_ERROR,
  ],
  callAPI: () => API.put(`/salelist/${sale.id}`, {
    comicBookTitle: sale.comicBookTitle,
    comicIssue: sale.comicIssue,
    comicBookVolume: sale.comicBookVolume,
    comicBookYear: sale.comicBookYear,
    comicBookPublisher: sale.comicBookPublisher,
    comicBookCover: sale.comicBookCover,
    type: sale.type,
  }),
  payload: { id: sale.id },
});

export const deleteSale = id => ({
  types: [
    DELETE_SALE_COMIC_PENDING,
    DELETE_SALE_COMIC_SUCCESS,
    DELETE_SALE_COMIC_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/salelist/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchSales;
