// import the express router
const router = require('express').Router();

// load in the comicbooktitle Model
const { ComicBookTitles } = require('../models');

// import the comicbooktitle controller
const comicbooktitleCtrl = require('../controllers/comicbooktitles');
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

// GET /comicbooktitles?collectpubId=___
router.get('/publishers/:pubId', comicbooktitleCtrl.getCollectPublisherComicBookTitles);

// POST /comicbooktitles
router.post('/', [
  validationCtrl.validate('createComicBookTitle'),
  comicbooktitleCtrl.createComicBookTitle,
], async (req, res) => {
  try {
    if (!req.body.cbTitle) {
      throwError(400, 'incorrect request')();
    }

    const comicbooktitle = await ComicBookTitles
      .findOne({ where: { cbTitle: req.body.cbTitle } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'Comic book title not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, comicbooktitle);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /comicbooktitles/:id
router.get('/:id', comicbooktitleCtrl.getOneById);

// PUT /comicbooktitles/:id
router.put('/:id', [
  validationCtrl.validate('editComicBookTitle'),
  comicbooktitleCtrl.updateComicBookTitle,
]);

// DELETE /comicbooktitles/:id
router.delete('/:id', [
  validationCtrl.validate('deleteComicBookTitle'),
  comicbooktitleCtrl.removeComicBookTitle,
]);

// export the route from this file
module.exports = router;
