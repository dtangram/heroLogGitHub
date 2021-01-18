import createReducer from '../helpers/createReducer';

import {
  REQ_USER_PROFILE_PENDING,
  REQ_USER_PROFILE_SUCCESS,
  REQ_USER_PROFILE_ERROR,
  REQ_USER_LOGOUT,
} from '../actionTypes';

const initialState = {
  data: undefined,
  // tracking if the state is loading
  isLoading: false,
  // any errors loading all the data
  error: null,
};

function logout(staste, action) {
  return initialState;
}

function userProfilePending(state, action) {
  // set loading state and clear error

  return {
    ...state,
    isLoading: true,
    error: null,
    // byId: {
    //   ...state.byId,
    //   [action.payload.id]: {
    //     ...state.byId[action.payload.id],
    //     isLoading: true,
    //     error: null,
    //   },
    // },
  };
}

function userProfileSuccess(state, action) {
  // clear loading and error, update cache time, add signins
  return {
    ...state,
    isLoading: false,
    data: action.data,
  };
}

function userProfileError(state, action) {
  // clear loading and set error
  return {
    ...state,
    isLoading: false,
    error: true,
    data: undefined,
  };
}

export default createReducer(initialState, {
  [REQ_USER_LOGOUT]: logout,
  [REQ_USER_PROFILE_PENDING]: userProfilePending,
  [REQ_USER_PROFILE_SUCCESS]: userProfileSuccess,
  [REQ_USER_PROFILE_ERROR]: userProfileError,
});
