// load in the wishlist Model
const { WishLists } = require('../models');

// get all the comicbooks for wishList
// exports.getUserWishLists = async (req, res) => {
//   // run the find all function on the model
//   // filter the wishlists to only wishlists that were created by this user
//   const userWishLists = await WishLists.findAll({ where: { userId: req.params.userId } });
//   // respond with json of the user decisions array
//   res.json(userWishLists);
// };

// get all the comicbooks for wishList
exports.getWishLists = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishListLists = await WishLists.findAll({
      where: { wishUsersId: userId },
    });
    // Use for endpoints
    // const { comicBookTitle } = req.body;
    // const wishListLists = await WishLists.findAll({ where: { comicBookTitle } });

    // respond with json of the public questions array
    res.json(wishListLists);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// get all the comicbooks with a type of regular
exports.getRegular = async (req, res) => {
  // run the find all function on the model
  const regularWishLists = await WishLists.findAll({ where: { type: 'regular' } });
  // respond with json of the regular comicbooks array
  res.json(regularWishLists);
};

// get all the comicbooks with a type of variant
exports.getVariant = async (req, res) => {
  // run the find all function on the model
  const variantWishLists = await WishLists.findAll({ where: { type: 'variant' } });
  // respond with json of the variant comicbooks array
  res.json(variantWishLists);
};

// find one wishlist by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our wishlist model for the wishlist
  const wishlist = await WishLists.findByPk(id);
  // if no wishlist is found
  if (!wishlist) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the wishlist is found send it back.
  res.json(wishlist);
};

// add a new wishlist
exports.createWishList = async (req, res) => {
  // get the name, type and userId values from the request body
  const {
    comicBookTitle, comicBookVolume, comicBookYear, comicBookPublisher,
    comicBookCover, type, wishUsersId,
  } = req.body;

  // const { userId } = req.userId;

  try {
    // create the item and save the new id
    const newWishList = await WishLists.create({
      comicBookTitle,
      comicBookVolume,
      comicBookYear,
      comicBookPublisher,
      comicBookCover,
      type,
      wishUsersId,
    });

    // send the new id back to the request
    res.json({ id: newWishList.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing wishlist
exports.updateWishList = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the wishlist with the request body
    const [, [updatedWishList]] = await WishLists.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated wishlist back to the front-end
    res.json(updatedWishList);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a wishlist
exports.removeWishList = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the wishlist
  await WishLists.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
