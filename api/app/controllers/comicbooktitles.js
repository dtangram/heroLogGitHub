// load in the comicbooktitle Model
const { ComicBookTitles } = require('../models');

// get all the comicbooktitles with a type of public
exports.getCollectPublisherComicBookTitles = async (req, res) => {
  // assign cbTitle to req.body
  try {
    const { pubId } = req.params;
    // run the find all function on the model
    const comicbooktitleComicBookTitles = await ComicBookTitles.findAll({
      where: { collectpubId: pubId },
    });
    // Use for endpoints
    // const { cbTitle } = req.body;
    // const comicbooktitleComicBookTitles = await ComicBookTitles.findAll({ where: { cbTitle } });

    // respond with json of the public comicbooktitles array
    res.json(comicbooktitleComicBookTitles);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// find one comicbooktitle by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our comicbooktitle model for the comicbooktitle
  const comicbooktitle = await ComicBookTitles.findByPk(id);
  // if no comicbooktitle is found
  if (!comicbooktitle) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the comicbooktitle is found send it back.
  res.json(comicbooktitle);
};

// add a new comicbooktitle
exports.createComicBookTitle = async (req, res) => {
  // get the cbTitle, collectpubId and comicbooktitleId values from the request body
  const { cbTitle, collectpubId, id: comicbooktitlerelId } = req.body;
  // pull the comicbooktitle id from the url params
  // const { collectpubId } = req.params;
  // const { id: comicbooktitlerelId } = req.params;
  try {
    // create the item and save the new id
    const newComicBookTitle = await ComicBookTitles.create({
      cbTitle, comicbooktitlerelId, collectpubId,
    });

    // send the new id back to the request
    res.json({ id: newComicBookTitle.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing comicbooktitle
exports.updateComicBookTitle = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the comicbooktitle with the request body
    const [, [updatedComicBookTitle]] = await ComicBookTitles.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated comicbooktitle bback to the front-end
    res.json(updatedComicBookTitle);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a comicbooktitle
exports.removeComicBookTitle = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the comicbooktitle
  await ComicBookTitles.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
