// import the express router
const router = require('express').Router();

// load in the wishlist Model
const { WishLists } = require('../models');

// import the wishlist controller
const wishlistCtrl = require('../controllers/wishlist');
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

// GET /wishlists route using controller middleware
// router.get('/', protectedRoute, wishlistCtrl.getUserWishLists);

// GET /wishlists
router.get('/regular', wishlistCtrl.getRegular);

// GET /wishlists route using controller middleware
router.get('/variant', wishlistCtrl.getVariant);

router.get('/signups/:userId', wishlistCtrl.getWishLists);

// POST /wishlists
router.post('/', [
  validationCtrl.validate('createWishLists'),
  wishlistCtrl.createWishList,
], async (req, res) => {
  try {
    if (!req.body.comicBookTitle) {
      throwError(400, 'incorrect request')();
    }

    const comicbookSale = await WishLists
      .findOne({ where: { comicBookTitle: req.body.comicBookTitle } })
      .then(
        throwIf(cbErr => !cbErr, 400, 'not found', 'Comic book title not found'),
        throwError(500, 'sequelize error'),
      );
    sendSuccess(res, comicbookSale);
  } catch (error) {
    sendError(res)(error);
  }
});

// GET /wishlists/:id
router.get('/:id', wishlistCtrl.getOneById);

// PUT /wishlists/:id
router.put('/:id', [
  validationCtrl.validate('editWishLists'),
  wishlistCtrl.updateWishList,
]);

// DELETE /wishlists/:id
router.delete('/:id', [
  validationCtrl.validate('deleteWishLists'),
  wishlistCtrl.removeWishList,
]);

// export the route from this file
module.exports = router;
