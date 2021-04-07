// import the express router
const router = require('express').Router();

// load in the messaging Model
const { Messagings } = require('../models');

// import the messaging controller
const messagingCtrl = require('../controllers/messaging');
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

// GET /messagings route using controller middleware
// router.get('/', messagingCtrl.getUserMessagings);

router.get('/signups/:userId', messagingCtrl.getMessagings);
router.get('/signupsMessSent/:userId', messagingCtrl.getSentMessagings);

// POST /messagings
router.post('/', [
  validationCtrl.validate('createMessaging'),
  messagingCtrl.createMessaging,
], async (req, res) => {
  try {
    if (!req.body.name) {
      throwError(400, 'incorrect request')();
    }

    const messaging = await Messagings
      .findOne({ where: { name: req.body.name } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'Message not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, messaging);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /messagings/:id
router.get('/:id', messagingCtrl.getOneById);

// PUT /messagings/:id
router.put('/:id', [
  validationCtrl.validate('editMessaging'),
  messagingCtrl.updateMessaging,
]);

// DELETE /messagings/:id
router.delete('/:id', [
  validationCtrl.validate('deleteMessagings'),
  messagingCtrl.removeMessaging,
]);

// export the route from this file
module.exports = router;
