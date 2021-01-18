import uuid from 'uuid/v1';
import API from '../../API';
import {
  REQ_USERS_PENDING,
  REQ_USERS_SUCCESS,
  REQ_USERS_ERROR,
  REQ_USER_PENDING,
  REQ_USER_SUCCESS,
  REQ_USER_ERROR,
  ADD_USER_PENDING,
  ADD_USER_SUCCESS,
  ADD_USER_ERROR,
  UPDATE_USER_PENDING,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  DELETE_USER_PENDING,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
} from '../actionTypes';

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

const userId = localStorage.getItem('id');

export const fetchUsers = () => ({
  // types for this action - "request, success, error"
  types: [REQ_USERS_PENDING, REQ_USERS_SUCCESS, REQ_USERS_ERROR],
  //  a function used to call the api
  callAPI: () => API.get(`/users/signups/${userId}`),
  // receives the current app state and returns true if we should call the api
  shouldCallAPI: (state) => {
    const { loadedAt, isLoading } = state.signups;
    // if users are currently loading don't call again
    if (isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    // if we don't have the signup or it's beyond the cache timeout make the api call
    return !loadedAt || !isCached;
  },
  payload: { userId },
});

export const createUser = (signup) => {
  // create a uuid for this signup so that we can use it in the reducer for pending and loading
  const id = uuid();
  return {
    types: [ADD_USER_PENDING, ADD_USER_SUCCESS, ADD_USER_ERROR],
    callAPI: () => API.post('/users/', { id, ...signup }),
    payload: { id, signup },
  };
};

export const fetchUser = id => ({
  types: [REQ_USER_PENDING, REQ_USER_SUCCESS, REQ_USER_ERROR],
  callAPI: () => API.get(`/users/${userId}`),
  shouldCallAPI: (state) => {
    const signup = state.signups.byId[id] || {};
    const { loadedAt, isLoading } = signup;
    if (!signup || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export const updateUser = user => ({
  types: [UPDATE_USER_PENDING, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR],
  callAPI: () => API.put(`/users/${user.id}`, {
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    password: user.password,
    type: user.type,
  }),
  payload: { id: user.id },
});

export const deleteUser = id => ({
  types: [DELETE_USER_PENDING, DELETE_USER_SUCCESS, DELETE_USER_ERROR],
  // send the delete to the api
  callAPI: () => API.delete(`/users/${id}`, { params: { id } }),
  // dispatch the action to remove the user with the id to remove
  payload: { id },
});

export default fetchUsers;
