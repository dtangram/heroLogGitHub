import uuid from 'uuid/v1';
import API from '../../API';
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

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

export const fetchComicBooks = titleID => ({
  // types for this action - "request, success, error"
  types: [REQ_COMIC_BOOKS_PENDING, REQ_COMIC_BOOKS_SUCCESS, REQ_COMIC_BOOKS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/comicbook/titles/${titleID}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.comicbooklistissues;
    // if comicbooklistissues are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the comicbooklistissue or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { titleID },
});

export const createComicBook = (comicbooklistissue) => {
  // create a uuid for this comicbooklistissue so that we can use it in the
  // reducer for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_COMIC_BOOK_PENDING,
      ADD_COMIC_BOOK_SUCCESS,
      ADD_COMIC_BOOK_ERROR,
    ],
    callAPI: () => API.post('/comicbook/', { id, ...comicbooklistissue }),
    payload: { id, comicbooklistissue },
  };
};

export const fetchComicBook = id => ({
  types: [REQ_COMIC_BOOK_PENDING, REQ_COMIC_BOOK_SUCCESS, REQ_COMIC_BOOK_ERROR],
  callAPI: () => API.get(`/comicbook/${id}`),
  shouldCallAPI: (state) => {
    const comicbooklistissue = state.comicbooklistissues.byId[id] || {};
    const { loadedAt, isLoading } = comicbooklistissue;
    if (!comicbooklistissue || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateComicBook = comicbook => ({
  types: [
    UPDATE_COMIC_BOOK_PENDING,
    UPDATE_COMIC_BOOK_SUCCESS,
    UPDATE_COMIC_BOOK_ERROR,
  ],
  callAPI: () => API.put(`/comicbook/${comicbook.id}`, {
    title: comicbook.title,
    comicIssue: comicbook.comicIssue,
    author: comicbook.author,
    penciler: comicbook.penciler,
    coverartist: comicbook.coverartist,
    inker: comicbook.inker,
    volume: comicbook.volume,
    year: comicbook.year,
    type: comicbook.type,
    comicBookCover: comicbook.comicBookCover,
  }),
  payload: { id: comicbook.id },
});

export const deleteComicBook = id => ({
  types: [
    DELETE_COMIC_BOOK_PENDING,
    DELETE_COMIC_BOOK_SUCCESS,
    DELETE_COMIC_BOOK_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/comicbook/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchComicBooks;
