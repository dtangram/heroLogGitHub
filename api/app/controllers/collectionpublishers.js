// load in the collectpublisher Model
const { CollectionPublishers } = require('../models');

// UNCOMMENT WHEN READY FOR USER
// exports.getUserCollectionPublishers = async (req, res) => {
//   // run the find all function on the model
//   // filter the collectpublishers to only collectpublishers that were created by this user
//   const userCollectionPublishers = await CollectionPublishers.findAll({
//     where: {
//       userId: req.params.userId,
//     },
//   });
//   // respond with json of the user collectpublisher array
//   res.json(userCollectionPublishers);
// };

// get all the publishers
exports.getCollectionPublishers = async (req, res) => {
  const { userId } = req.params;

  try {
    const collectPublishers = await CollectionPublishers.findAll({
      where: { collectpubUsersId: userId },
    });
    // Use for endpoints
    // const { publisherName } = req.body;
    // const collectPublishers = await CollectionPublishers.findAll({ where: { publisherName } });

    // respond with json of the public questions array
    res.json(collectPublishers);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// find one collectpublisher by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our collectpublisher model for the collectpublisher
  const collectpublisher = await CollectionPublishers.findByPk(id);
  // if no collectpublisher is found
  if (!collectpublisher) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the collectpublisher is found send it back.
  res.json(collectpublisher);
};

// add a new collectpublisher
exports.createCollectionPublisher = async (req, res) => {
  // get the publisherName, collectpubUsersId and userId values from the request body
  const { publisherName, collectpubUsersId } = req.body;

  // const { publisherName, id: collectpubUsersId } = req.body;

  try {
    // create the item and save the new id
    const newCollectionPublisher = await CollectionPublishers.create({
      publisherName, collectpubUsersId,
    });

    // send the new id back to the request
    res.json({ id: newCollectionPublisher.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing collectpublisher
exports.updateCollectionPublisher = async (req, res) => {
  // get the id from the url params
  // const { id } = req.params;

  try {
    // update the collectpublisher with the request body
    const [, [updatedCollectionPublisher]] = await CollectionPublishers.update(req.body, {
      // only update the row using the id in the url
      where: { id: req.params.id },
      // return the updated row
      returning: true,
    });

    // send the updated collectpublisher back to the front-end
    res.json(updatedCollectionPublisher);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a collectpublisher
exports.removeCollectionPublisher = async (req, res) => {
  // console.log("req.params", req.params);
  // get the id from the url params
  const { id } = req.params;
  // remove the collectpublisher
  await CollectionPublishers.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
