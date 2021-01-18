import API from '../../API';
import {
  REQ_LOGIN_PENDING,
  REQ_LOGIN_SUCCESS,
  REQ_LOGIN_ERROR,
} from '../actionTypes';

// cache data for 5 minutes
const CACHE_TIME = 1000 * 60 * 5;

export const loginUser = (signin) => {
  const { username, password } = signin;
  // create a uuid for this signin so that we can use it in the reducer for pending and loading
  return {
    types: [REQ_LOGIN_PENDING, REQ_LOGIN_SUCCESS, REQ_LOGIN_ERROR],
    callAPI: () => API.post('/auth/login', { username, password })
      .then((res) => {
        if (res && res.token) {
          const resData = JSON.stringify(res.data)
            .substring(16)
            .replace(/["/{/}/]/gi, '')
            .replace(/,/gi, '\n')
            .replace(/:/gi, ': ')
            .replace(/timestamp/gi, 'Timestamp')
            .replace(/base/gi, 'Base')
            .replace(/date/gi, 'Date')
            .replace(/rates:/gi, 'Rates:\n');

          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.id);
          localStorage.setItem('data', resData);
        }
        return res;
      }),
    payload: { signin },
  };
};

export const fetchLoginUser = id => ({
  types: [REQ_LOGIN_PENDING, REQ_LOGIN_SUCCESS, REQ_LOGIN_ERROR],
  callAPI: () => API.get(`/users/${id}`),
  shouldCallAPI: (state) => {
    const signin = state.signins.byId[id] || {};
    const { loadedAt, isLoading } = signin;
    if (!signin || isLoading) return false;
    const isCached = Date.now() - loadedAt < CACHE_TIME;
    return !loadedAt || !isCached;
  },
  payload: { id },
});

export default loginUser;
