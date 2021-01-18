import API from '../../API';
import {
  REQ_EMAILPASSWORDRESET_PENDING,
  REQ_EMAILPASSWORDRESET_SUCCESS,
  REQ_EMAILPASSWORDRESET_ERROR,
} from '../actionTypes';

export const emailpasswordresetUser = (emailpasswordreset) => {
  const { email } = emailpasswordreset;
  return {
    types: [
      REQ_EMAILPASSWORDRESET_PENDING,
      REQ_EMAILPASSWORDRESET_SUCCESS,
      REQ_EMAILPASSWORDRESET_ERROR,
    ],
    callAPI: () => API.post('/emailpasswordreset', { email }),
    payload: { email },
  };
};

export default emailpasswordresetUser;
