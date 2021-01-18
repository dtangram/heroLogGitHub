// load in the salelist Model
const { SaleLists } = require('../models');

// get all the comicbooks for sale
// exports.getUserSaleLists = async (req, res) => {
//   // run the find all function on the model
//   // filter the salelists to only salelists that were created by this user
//   const userSaleLists = await SaleLists.findAll({ where: { userId: req.params.userId } });
//   // respond with json of the user decisions array
//   res.json(userSaleLists);
// };

// get all the comicbooks for sale
exports.getSaleLists = async (req, res) => {
  const { userId } = req.params;

  try {
    const saleLists = await SaleLists.findAll({
      where: { saleUsersId: userId },
    });
    // Use for endpoints
    // const { comicBookTitle } = req.body;
    // const saleLists = await SaleLists.findAll({ where: { comicBookTitle } });

    // respond with json of the public questions array
    res.json(saleLists);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// get all the comicbooks with a type of regular
exports.getRegular = async (req, res) => {
  // run the find all function on the model
  const regularSaleLists = await SaleLists.findAll({ where: { type: 'regular' } });
  // respond with json of the regular comicbooks array
  res.json(regularSaleLists);
};

// get all the comicbooks with a type of variant
exports.getVariant = async (req, res) => {
  // run the find all function on the model
  const variantSaleLists = await SaleLists.findAll({ where: { type: 'variant' } });
  // respond with json of the variant comicbooks array
  res.json(variantSaleLists);
};

// find one salelist by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our salelist model for the salelist
  const salelist = await SaleLists.findByPk(id);
  // if no salelist is found
  if (!salelist) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the salelist is found send it back.
  res.json(salelist);
};

// add a new salelist
exports.createSaleList = async (req, res) => {
  // get the name, type and userId values from the request body
  const {
    comicBookTitle, comicBookVolume, comicBookYear, comicBookPublisher, comicBookCover,
    type, saleUsersId,
  } = req.body;

  // const { userId } = req.userId;

  try {
    // create the item and save the new id
    const newSaleList = await SaleLists.create({
      comicBookTitle,
      comicBookVolume,
      comicBookYear,
      comicBookPublisher,
      comicBookCover,
      type,
      saleUsersId,
    });

    // send the new id back to the request
    res.json({ id: newSaleList.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing salelist
exports.updateSaleList = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the salelist with the request body
    const [, [updatedSaleList]] = await SaleLists.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated salelist back to the front-end
    res.json(updatedSaleList);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a salelist
exports.removeSaleList = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the salelist
  await SaleLists.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
