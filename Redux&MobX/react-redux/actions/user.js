const { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } = require('../actions/constantAction');

// async action creator (비동기)
const logIn = (data) => (dispatch, getState) => {
  // async action (비동기 액션)
  dispatch(logInRequest(data));
  try {
    setTimeout(() => dispatch(logInSuccess({ userid: 1, nickname: 'vicky' })), 2000);
  } catch (err) {
    dispatch(logInFailure(err));
  }
};

// async action (비동기 액션)
const logInRequest = (data) => ({ type: LOG_IN_REQUEST, data });
const logInSuccess = (data) => ({ type: LOG_IN_SUCCESS, data });
const logInFailure = (err) => ({ type: LOG_IN_FAILURE, err });

// sync action Creator (동기)
const logOut = () => ({ type: 'LOG_OUT' });

module.exports = { logIn, logOut };
