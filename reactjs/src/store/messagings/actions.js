import uuid from 'uuid/v1';
import API from '../../API';
import {
  REQ_MESSAGINGS_PENDING,
  REQ_MESSAGINGS_SUCCESS,
  REQ_MESSAGINGS_ERROR,
  REQ_MESSAGING_PENDING,
  REQ_MESSAGING_SUCCESS,
  REQ_MESSAGING_ERROR,
  ADD_MESSAGING_PENDING,
  ADD_MESSAGING_SUCCESS,
  ADD_MESSAGING_ERROR,
  UPDATE_MESSAGING_PENDING,
  UPDATE_MESSAGING_SUCCESS,
  UPDATE_MESSAGING_ERROR,
  DELETE_MESSAGE_PENDING,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_ERROR,
} from '../actionTypes';

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');
// console.log("id: ", userId);

export const fetchMessagings = () => ({
  // types for this action - "request, success, error"
  types: [REQ_MESSAGINGS_PENDING, REQ_MESSAGINGS_SUCCESS, REQ_MESSAGINGS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/messaging/signups/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.messagings;
    // if messagings are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the messaging or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const fetchMessagingsSent = () => ({
  // types for this action - "request, success, error"
  types: [REQ_MESSAGINGS_PENDING, REQ_MESSAGINGS_SUCCESS, REQ_MESSAGINGS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/messaging/signupsMessSent/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.messagings;
    // if messagings are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the messaging or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const createMessaging = (messaging) => {
  // create a uuid for this messaging so that we can use it in the reducer for pending and loading
  const id = uuid();
  return {
    types: [
      ADD_MESSAGING_PENDING,
      ADD_MESSAGING_SUCCESS,
      ADD_MESSAGING_ERROR,
    ],
    callAPI: () => API.post('/messaging/', { id, ...messaging }),
    payload: { id },
  };
};

export const fetchMessaging = id => ({
  types: [REQ_MESSAGING_PENDING, REQ_MESSAGING_SUCCESS, REQ_MESSAGING_ERROR],
  callAPI: () => API.get(`/messaging/${id}`),
  shouldCallAPI: (state) => {
    const messaging = state.messagings.byId[id] || {};
    const { loadedAt, isLoading } = messaging;
    if (!messaging || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateMessaging = messaging => ({
  types: [
    UPDATE_MESSAGING_PENDING,
    UPDATE_MESSAGING_SUCCESS,
    UPDATE_MESSAGING_ERROR,
  ],
  callAPI: () => API.put(`/messaging/${messaging.id}`, {
    name: messaging.name,
    email: messaging.email,
    message: messaging.message,
    messageUsersId: messaging.messageUsersId,
    subject: messaging.subject,
    userSent: messaging.userSent,
  }),
  payload: { id: messaging.id },
});

export const deleteMessaging = id => ({
  types: [
    DELETE_MESSAGE_PENDING,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_ERROR,
  ],
  // send the delete to the api
  callAPI: () => API.delete(`/messaging/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchMessagings;
