// import the express router
const router = require('express').Router();

// load in the user Model
const { Users } = require('../models');

// import the user controller
const userCtrl = require('../controllers/user');
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

// import the protect middleware
// const protectedRoute = require('../utils/protectedRoute');

router.get('/signups/:userId', userCtrl.getUser);

// GET /users
router.get('/regular', userCtrl.getRegular);

// GET /users route using controller middleware
router.get('/fixer', userCtrl.getFixer);

// POST /users
router.post('/', [
  validationCtrl.validate('signup'),
  userCtrl.createUser,
], async (req, res) => {
  try {
    if (!req.body.username) {
      throwError(400, 'incorrect request')();
    }

    const user = await Users
      .findOne({ where: { username: req.body.username } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'User not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, user);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /users/:id
router.get('/:id', userCtrl.getOneById);

// PUT /users/:id
router.put('/:id', userCtrl.updateUser);

// DELETE /users/:id
router.delete('/:id', userCtrl.removeUser);

// export the route from this file
module.exports = router;
