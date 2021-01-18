import API from '../../API';
import {
  REQ_SALE_ALL_COMICS_PENDING,
  REQ_SALE_ALL_COMICS_SUCCESS,
  REQ_SALE_ALL_COMICS_ERROR,
} from '../actionTypes';

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');

export const fetchALLSales = () => ({
  // types for this action - "request, success, error"
  types: [
    REQ_SALE_ALL_COMICS_PENDING,
    REQ_SALE_ALL_COMICS_SUCCESS,
    REQ_SALE_ALL_COMICS_ERROR,
  ],
  //  a function used to call the api
  callAPI: () => API.get('/salelistALL/'),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.salesALL;
    // if salesALL are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the sale or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export default fetchALLSales;
