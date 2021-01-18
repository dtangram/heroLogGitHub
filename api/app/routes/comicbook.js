// import the express router
const router = require('express').Router();

// load in the comicbooks Model
const { ComicBooks } = require('../models');

// import the comicbook controller
const comicbookCtrl = require('../controllers/comicbook');
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

// GET /comicbook?cbTitleId=___
router.get('/titles/:coboTitleId', comicbookCtrl.getComicBooks);

// GET /comicbook
router.get('/regular', [
  validationCtrl.validate('createComicBook'),
  comicbookCtrl.getComicBookRegular,
]);

// GET /comicbook route using controller middleware
router.get('/variant', [
  validationCtrl.validate('createComicBook'),
  comicbookCtrl.getComicBookVariant,
]);

// POST /comicbook
router.post('/', [
  validationCtrl.validate('createComicBook'),
  comicbookCtrl.createComicBook,
], async (req, res) => {
  try {
    if (!req.body.title) {
      throwError(400, 'incorrect request')();
    }

    const comicbook = await ComicBooks
      .findOne({ where: { title: req.body.title } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'Comic book not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, comicbook);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /comicbook/:id
router.get('/:id', comicbookCtrl.getOneById);

// PUT /comicbook/:id
router.put('/:id', [
  validationCtrl.validate('editComicBook'),
  comicbookCtrl.updateComicBook,
]);

// DELETE /comicbook/:id
router.delete('/:id', [
  validationCtrl.validate('deleteComicBook'),
  comicbookCtrl.removeComicBook,
]);

// export the route from this file
module.exports = router;
