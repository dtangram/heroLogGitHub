import uuid from 'uuid/v1';
import API from '../../API';
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

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');
// console.log("id: ", userId);

export const fetchPublishers = () => ({
  // types for this action - "request, success, error"
  types: [REQ_PUBLISHERS_PENDING, REQ_PUBLISHERS_SUCCESS, REQ_PUBLISHERS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/collectionpublishers/signups/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.publishers;
    // if publishers are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the publisher or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const createPublisher = (publisher) => {
  // create a uuid for this publisher so that we can use it in the reducer for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_PUBLISHER_PENDING,
      ADD_PUBLISHER_SUCCESS,
      ADD_PUBLISHER_ERROR,
    ],
    callAPI: () => API.post('/collectionpublishers', { id, ...publisher }),
    payload: { id, publisher },
  };
};

export const fetchPublisher = id => ({
  types: [REQ_PUBLISHER_PENDING, REQ_PUBLISHER_SUCCESS, REQ_PUBLISHER_ERROR],
  callAPI: () => API.get(`/collectionpublishers/${id}`),
  shouldCallAPI: (state) => {
    const publisher = state.publishers.byId[id] || {};
    const { loadedAt, isLoading } = publisher;
    if (!publisher || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updatePublisher = publisher => ({
  types: [
    UPDATE_PUBLISHER_PENDING,
    UPDATE_PUBLISHER_SUCCESS,
    UPDATE_PUBLISHER_ERROR,
  ],
  callAPI: () => API.put(`/collectionpublishers/${publisher.id}`, {
    publisherName: publisher.publisherName,
  }),
  payload: { id: publisher.id },
});

export const deletePublisher = id => ({
  types: [
    DELETE_PUBLISHER_PENDING,
    DELETE_PUBLISHER_SUCCESS,
    DELETE_PUBLISHER_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/collectionpublishers/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchPublishers;
