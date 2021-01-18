const { check, validationResult } = require('express-validator');

const checks = {
  firstname: check('firstname')
    .exists().withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name is required to be with at least 2 characters.'),
  lastname: check('lastname')
    .exists().withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name is required to be with at least 2 characters.'),
  username: check('username')
    .exists().withMessage('Username is required')
    .isLength({ min: 2 })
    .withMessage('Username is required to be with at least 2 characters.'),
  email: check('email')
    .exists().withMessage('Email is required.')
    .isEmail()
    .withMessage('Email field must be valid.'),
  password: check('password')
    .exists().withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password is required to be at least 8 characters.'),
  typeS: check('type')
    .exists().withMessage('Signup type is required.')
    .isIn(['regular', 'fixer'])
    .withMessage('Signup must be Regular or Fixer.'),
  id: check('id')
    .isUUID().withMessage('ID not valid, please try again.'),
  name: check('name')
    .exists().withMessage('Name is required.')
    .isLength(3)
    .withMessage('Name is required to be at least 3 characters.'),
  message: check('message')
    .exists().withMessage('Message is required.')
    .isLength(10)
    .withMessage('Message is required to be at least 10 characters.'),
  typeRV: check('type')
    .exists().withMessage('Comic Book type is required.')
    .isIn(['regular', 'variant'])
    .withMessage('Comic Book must be regular or variant.'),
  userId: check('userId')
    .isUUID().withMessage('User ID not valid, please try again.'),
  cbTitle: check('cbTitle')
    .exists().withMessage('Comic Book title is required.')
    .isLength(1)
    .withMessage('Comic Book title is required to be at least 1 character.'),
  collectpubId: check('collectpubId')
    .isUUID().withMessage('Publisher ID not valid, please try again.'),
  title: check('title')
    .exists().withMessage('Comic Book issue title is required')
    .isLength(1)
    .withMessage('Comic Book issue title is required to be at least 1 character.'),
  publisherName: check('publisherName')
    .exists().withMessage('Publisher name is required')
    .isLength(2)
    .withMessage('Publisher name is required to be at least 2 character.'),
  comicbooktitlerelId: check('comicbooktitlerelId')
    .isUUID().withMessage('Comic Book Title ID not valid, please try again.'),
  comicBookTitle: check('comicBookTitle')
    .exists().withMessage('Comic Book title is required.')
    .isLength(1)
    .withMessage('Comic Book title is required to be at least 1 character.'),
};

const checkForErrors = (req, res, next) => {
  // get any errors
  const errors = validationResult(req);
  // if there are errors go to the next error handler middleware with the errors from the validation
  if (!errors.isEmpty()) return next(errors.mapped());
  // if there are NO errors, go to the next normal middleware function
  return next();
};

exports.validate = (method) => {
  switch (method) {
    case 'signup': {
      return [
        checks.username,
        checks.firstname,
        checks.lastname,
        checks.email,
        checks.password,
        checks.typeS,
        checkForErrors,
      ];
    }

    case 'signin': {
      return [checks.username, checks.password, checkForErrors];
    }

    case 'createCollectionPublisher': {
      return [checks.publisherName, checkForErrors];
    }

    case 'editCollectionPublisher': {
      return [checks.id, checks.publisherName, checkForErrors];
    }

    case 'deleteCollectionPublisher': {
      return [checks.id, checkForErrors];
    }

    case 'createComicBookTitle': {
      return [checks.cbTitle, checkForErrors];
    }

    case 'editComicBookTitle': {
      return [checks.id, checks.cbTitle, checkForErrors];
    }

    case 'deleteComicBookTitle': {
      return [checks.id, checkForErrors];
    }

    case 'createComicBook': {
      return [checks.title, checks.typeRV, checkForErrors];
    }

    case 'editComicBook': {
      return [checks.id, checks.title, checks.typeRV, checkForErrors];
    }

    case 'deleteComicBook': {
      return [checks.id, checkForErrors];
    }

    case 'createMessaging': {
      return [checks.name, checks.email, checks.message, checkForErrors];
    }

    case 'editMessaging': {
      return [checks.id, checks.name, checks.email, checks.message, checkForErrors];
    }

    case 'deleteMessaging': {
      return [checks.id, checkForErrors];
    }

    case 'createSaleList': {
      return [checks.comicBookTitle, checks.typeRV, checkForErrors];
    }

    case 'editSaleList': {
      return [checks.id, checks.comicBookTitle, checks.typeRV, checkForErrors];
    }

    case 'deleteSaleList': {
      return [checks.id, checkForErrors];
    }

    case 'createWishLists': {
      return [checks.comicBookTitle, checks.typeRV, checkForErrors];
    }

    case 'editWishLists': {
      return [checks.id, checks.comicBookTitle, checks.typeRV, checkForErrors];
    }

    case 'deleteWishLists': {
      return [checks.id, checkForErrors];
    }

    case 'resetPassword': {
      return [checks.email, checks.password, checkForErrors];
    }

    default: {
      return [];
    }
  }
};
