// import the express router
const router = require('express').Router();

// load in the collectpublisher Model
const { CollectionPublishers } = require('../models');

// import the collectionpublisher controller
const collectionpublisherCtrl = require('../controllers/collectionpublishers');
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

// UNCOMMENT WHEN READY FOR USER
// GET /collectionpublishers route using controller middleware
// router.get('/', collectionpublisherCtrl.getUserCollectionPublishers);

router.get('/signups/:userId', collectionpublisherCtrl.getCollectionPublishers);

// POST /collectionpublishers
router.post('/', [
  validationCtrl.validate('createCollectionPublisher'),
  collectionpublisherCtrl.createCollectionPublisher,
], async (req, res) => {
  try {
    if (!req.body.publisherName) {
      throwError(400, 'incorrect request')();
    }

    const publisher = await CollectionPublishers
      .findOne({ where: { publisherName: req.body.publisherName } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'Publisher not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, publisher);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /collectionpublishers/:id
router.get('/:id', collectionpublisherCtrl.getOneById);

// PUT /collectionpublishers/:id
router.put('/:id', [
  validationCtrl.validate('editCollectionPublisher'),
  collectionpublisherCtrl.updateCollectionPublisher,
]);

// DELETE /collectionpublishers/:id
router.delete('/:id', [
  validationCtrl.validate('deleteCollectionPublisher'),
  collectionpublisherCtrl.removeCollectionPublisher,
]);

// export the route from this file
module.exports = router;
