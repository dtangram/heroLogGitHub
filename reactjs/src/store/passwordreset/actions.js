import API from '../../API';
import {
  REQ_PASSWORDRESET_PENDING,
  REQ_PASSWORDRESET_SUCCESS,
  REQ_PASSWORDRESET_ERROR,
  UPDATE_PASSWORDRESET_PENDING,
  UPDATE_PASSWORDRESET_SUCCESS,
  UPDATE_PASSWORDRESET_ERROR,
} from '../actionTypes';

export const passwordresetUser = token => ({
  types: [
    REQ_PASSWORDRESET_PENDING,
    REQ_PASSWORDRESET_SUCCESS,
    REQ_PASSWORDRESET_ERROR,
  ],
  callAPI: () => API.get(`/passwordreset/${token}`),
  payload: { token },
});

export const updatePasswordresetUser = token => ({
  types: [
    UPDATE_PASSWORDRESET_PENDING,
    UPDATE_PASSWORDRESET_SUCCESS,
    UPDATE_PASSWORDRESET_ERROR,
  ],
  callAPI: () => API.put(`/passwordreset/${token}`),
  payload: { token },
});

export default passwordresetUser;
