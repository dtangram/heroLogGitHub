// Import the express router
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const log = require('debug')('api:logging');
// load in the user Model
const { Users } = require('../models');
// import the auth controller
const passwordResetCtrl = require('../controllers/passwordreset');
const validationCtrl = require('../controllers/validation');
require('dotenv').config();

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

router.get('/:token', passwordResetCtrl.passwordReset);

router.post('/', [
  validationCtrl.validate('signin'),
  passwordResetCtrl.passwordReset,
],

async (req, res) => {
  try {
    if (!req.body.password) {
      throwError(400, 'incorrect request')();
    }

    const user = await Users
      .findOne({ where: { password: req.body.password } })
      .then(
        throwIf(r => !r, 400, 'not found', 'User not found'),
        throwError(500, 'sequelize error'),
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

router.put('/passwordResetUpdate', passwordResetCtrl.passwordResetUpdate);

// router.put('http://localhost:4000/users/:id?accesstoken=token', [
//   validationCtrl.validate('signin'),
//   passwordResetCtrl.passwordResetUpdate,
// ]);

// export the route from this file
module.exports = router;
