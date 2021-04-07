// load in the comicbooks Model
const { ComicBooks } = require('../models');

// get all the comicbooks
exports.getComicBooks = async (req, res) => {
  // assign cbTitle to req.body
  try {
    const { coboTitleId } = req.params;
    // run the find all function on the model
    const comicbookIssues = await ComicBooks.findAll({
      where: { comicbooktitlerelId: coboTitleId },
    });
    // Use for endpoints
    // const { title } = req.query;
    // const comicbookIssues = await ComicBooks.findAll({ where: { title } });

    // respond with json of the public comicbooktitles array
    res.json(comicbookIssues);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// get all the comicbooks with a type of regular
exports.getComicBookRegular = async (req, res) => {
  // run the find all function on the model
  const regularComicBooks = await ComicBooks.findAll({ where: { type: 'regular' } });
  // respond with json of the regular comicbooks array
  res.json(regularComicBooks);
};

// get all the comicbooks with a type of variant
exports.getComicBookVariant = async (req, res) => {
  // run the find all function on the model
  const variantComicBooks = await ComicBooks.findAll({ where: { type: 'variant' } });
  // respond with json of the variant comicbooks array
  res.json(variantComicBooks);
};

// find one comicbooks by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our comicbooks model for the comicbooks
  const comicbook = await ComicBooks.findByPk(id);
  // if no comicbooks is found
  if (!comicbook) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the comicbooks is found send it back.
  res.json(comicbook);
};


// add a new comicbooks
exports.createComicBook = async (req, res) => {
  // get title, author, penciler, coverartist, inker, volume, year, type
  // and cbTitleId values from the request body
  const {
    title, comicIssue, author, penciler, coverartist, inker, volume, year,
    comicBookCover, type, comicbooktitlerelId,
  } = req.body;

  try {
    // create the item and save the new id
    const newComicBooks = await ComicBooks.create({
      title,
      comicIssue,
      author,
      penciler,
      coverartist,
      inker,
      volume,
      year,
      comicBookCover,
      type,
      comicbooktitlerelId,
    });

    // send the new id back to the request
    res.json({ id: newComicBooks.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing comicbooks
exports.updateComicBook = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the comicbook with the request body
    const [, [updatedComicBooks]] = await ComicBooks.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated comicbook back to the front-end
    res.json(updatedComicBooks);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a comicbooks
exports.removeComicBook = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the comicbooks
  await ComicBooks.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
