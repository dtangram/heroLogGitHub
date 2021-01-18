import API from '../../API';
import {
  REQ_USER_PROFILE_PENDING,
  REQ_USER_PROFILE_SUCCESS,
  REQ_USER_PROFILE_ERROR,
  REQ_USER_LOGOUT,
} from '../actionTypes';

// const CACHE_TIME = 1000 * 60 * 5;

export const fetchLoginUser = () => {
  const userId = localStorage.getItem('id');
  return {
    types: [REQ_USER_PROFILE_PENDING, REQ_USER_PROFILE_SUCCESS, REQ_USER_PROFILE_ERROR],
    callAPI: () => API.get(`/users/${userId}`),
    shouldCallAPI: () => !!userId,
    // shouldCallAPI: (state) => {
    //   const signin = state.signins.byId[id] || {};
    //   const { loadedAt, isLoading } = signin;
    //   if (!signin || isLoading) return false;
    //   const isCached = Date.now() - loadedAt < CACHE_TIME;
    //   return !loadedAt || !isCached;
    // },
    payload: { id: userId },
  };
};

export const logout = () => ({
  types: [REQ_USER_LOGOUT, REQ_USER_LOGOUT, REQ_USER_LOGOUT],
  callAPI: () => ({}),
});
