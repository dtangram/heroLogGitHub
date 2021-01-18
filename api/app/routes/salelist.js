// import the express router
const router = require('express').Router();

// load in the salelist Model
const { SaleLists } = require('../models');

// import the salelist controller
const salelistCtrl = require('../controllers/salelist');
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

// GET /salelists route using controller middleware
// router.get('/', protectedRoute, salelistCtrl.getUserSaleLists);

router.get('/signups/:userId', salelistCtrl.getSaleLists);

// POST /salelists
router.post('/', [
  validationCtrl.validate('createSaleList'),
  salelistCtrl.createSaleList,
], async (req, res) => {
  try {
    if (!req.body.comicBookTitle) {
      throwError(400, 'incorrect request')();
    }

    const comicbookSale = await SaleLists
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

// GET /salelists/:id
router.get('/:id', salelistCtrl.getOneById);

// PUT /salelists/:id
router.put('/:id', [
  validationCtrl.validate('editSaleList'),
  salelistCtrl.updateSaleList,
]);

// DELETE /salelists/:id
router.delete('/:id', [
  validationCtrl.validate('deleteSaleList'),
  salelistCtrl.removeSaleList,
]);

// export the route from this file
module.exports = router;
