// import the express router
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log = require('debug')('api:logging');
// load in the user Model
const { Users } = require('../models');
// import the auth controller
const authCtrl = require('../controllers/auth');
const validationCtrl = require('../controllers/validation');

const throwError = (code, errorType, errorMessage) => (error) => {
  let newError = error;
  if (!newError) {
    newError = new Error(errorMessage || 'Default Error');
  }
  newError.code = code;
  newError.errorType = errorType;
  throw error;
};
const throwIf = (fn, code, errorType, errorMessage) => (result) => {
  if (fn(result)) {
    return throwError(code, errorType, errorMessage)();
  }
  return result;
};
const sendSuccess = (res, message) => (data) => {
  res.status(200).json({ type: 'success', message, data });
};
const sendError = (res, status, message) => (error) => {
  res.status(status || error.status).json({
    type: 'error',
    message: message || error.message,
    error,
  });
};

router.post('/login', [
  validationCtrl.validate('signin'),
  authCtrl.login,
],

async (req, res) => {
  try {
    if (!req.body.login) {
      throwError(400, 'incorrect request')();
    }

    const user = await Users
      .findOne({ where: { login: req.body.login } })
      .then(
        throwIf(r => !r, 400, 'not found', 'User not found'),
        throwError(500, 'sequelize error'),
      );

    await bcrypt
      .compare(req.body.password, user.password)
      .then(
        throwIf(r => !r, 400, 'incorrect', 'Password is incorrect'),
        throwError(500, 'bcrypt error'),
      );

    await user
      // .update({ lastlogin_at: sequelize.fn('NOW') })
      .catch((error) => {
        log('sequelize update error', error);
        // Do not throw an error because this action is optional
      });

    const token = await jwt.sign(user.id, '***');
    sendSuccess(res, 'User logged in')({ token });
  } catch (error) {
    sendError(res)(error);
  }
});

router.post('/googleLogin', authCtrl.googleLogin);

// export the route from this file
module.exports = router;
