import uuid from 'uuid/v1';
import API from '../../API';
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

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

export const fetchComicBookTitles = collpubId => ({
  // types for this action - "request, success, error"
  types: [
    REQ_COMIC_BOOK_TITLES_PENDING, REQ_COMIC_BOOK_TITLES_SUCCESS, REQ_COMIC_BOOK_TITLES_ERROR,
  ],
  //  a function used to call the api
  callAPI: () => API.get(`comicbooktitles/publishers/${collpubId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.comicbooklists;
    // if comicbooklist are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the comicbooklists or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { collpubId },
});

export const createComicBookTitle = (comicbooklist) => {
  // create a uuid for this comicbooklist so that we can use it in the reducer
  // for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_COMIC_BOOK_TITLE_PENDING,
      ADD_COMIC_BOOK_TITLE_SUCCESS,
      ADD_COMIC_BOOK_TITLE_ERROR,
    ],
    callAPI: () => API.post('/comicbooktitles/', { id, ...comicbooklist }),
    payload: { id, comicbooklist },
  };
};

export const fetchComicBookTitle = id => ({
  types: [REQ_COMIC_BOOK_TITLE_PENDING, REQ_COMIC_BOOK_TITLE_SUCCESS, REQ_COMIC_BOOK_TITLE_ERROR],
  callAPI: () => API.get(`/comicbooktitles/${id}`),
  shouldCallAPI: (state) => {
    const comicbooklist = state.comicbooklists.byId[id] || {};
    const { loadedAt, isLoading } = comicbooklist;
    if (!comicbooklist || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateComicBookTitle = comicbooktitle => ({
  types: [
    UPDATE_COMIC_BOOK_TITLE_PENDING,
    UPDATE_COMIC_BOOK_TITLE_SUCCESS,
    UPDATE_COMIC_BOOK_TITLE_ERROR,
  ],
  callAPI: () => API.put(`/comicbooktitles/${comicbooktitle.id}`, {
    cbTitle: comicbooktitle.cbTitle,
  }),
  payload: { id: comicbooktitle.id },
});

export const deleteComicBookTitle = id => ({
  types: [
    DELETE_COMIC_BOOK_TITLE_PENDING,
    DELETE_COMIC_BOOK_TITLE_SUCCESS,
    DELETE_COMIC_BOOK_TITLE_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/comicbooktitles/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchComicBookTitles;
