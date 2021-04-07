import uuid from 'uuid/v1';
import API from '../../API';
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

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');

export const fetchWishLists = () => ({
  // types for this action - "request, success, error"
  types: [REQ_WISHLIST_COMICS_PENDING, REQ_WISHLIST_COMICS_SUCCESS, REQ_WISHLIST_COMICS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/wishlist/signups/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.wishlists;
    // if wishlists are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the wishlist or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const createWishList = (wishlist) => {
  // create a uuid for this wishlist so that we can use it in the reducer for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_WISHLIST_COMIC_PENDING,
      ADD_WISHLIST_COMIC_SUCCESS,
      ADD_WISHLIST_COMIC_ERROR,
    ],
    callAPI: () => API.post('/wishlist/', { id, ...wishlist }),
    payload: { id },
  };
};

export const fetchWishList = id => ({
  types: [REQ_WISHLIST_COMIC_PENDING, REQ_WISHLIST_COMIC_SUCCESS, REQ_WISHLIST_COMIC_ERROR],
  callAPI: () => API.get(`/wishlist/${id}`),
  shouldCallAPI: (state) => {
    const wishlist = state.wishlists.byId[id] || {};
    const { loadedAt, isLoading } = wishlist;
    if (!wishlist || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateWishList = wishlist => ({
  types: [
    UPDATE_WISHLIST_COMIC_PENDING,
    UPDATE_WISHLIST_COMIC_SUCCESS,
    UPDATE_WISHLIST_COMIC_ERROR,
  ],
  callAPI: () => API.put(`/wishlist/${wishlist.id}`, {
    comicBookTitle: wishlist.comicBookTitle,
    comicIssue: wishlist.comicIssue,
    comicBookVolume: wishlist.comicBookVolume,
    comicBookYear: wishlist.comicBookYear,
    comicBookPublisher: wishlist.comicBookPublisher,
    comicBookCover: wishlist.comicBookCover,
    type: wishlist.type,
  }),
  payload: { id: wishlist.id },
});

export const deleteWishList = id => ({
  types: [
    DELETE_WISHLIST_COMIC_PENDING,
    DELETE_WISHLIST_COMIC_SUCCESS,
    DELETE_WISHLIST_COMIC_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/wishlist/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchWishLists;
