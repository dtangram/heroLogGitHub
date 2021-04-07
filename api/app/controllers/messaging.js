// load in the messaging Model
const { Messagings } = require('../models');

// exports.getUserMessagings = async (req, res) => {
//   // run the find all function on the model
//   // filter the messagings to only messagings that were created by this user
//   const userMessagings = await Messagings.findAll({ where: { userId: req.params.userId } });
//   // respond with json of the user decisions array
//   res.json(userMessagings);
// };

// get all the comicbooks for sale
exports.getMessagings = async (req, res) => {
  const { userId } = req.params;
  try {
    const messagings = await Messagings.findAll({
      where: { messageUsersId: userId },
    });
    // Use for endpoints
    // const { name } = req.body;
    // const messagings = await Messagings.findAll({ where: { name } });

    // respond with json of the public questions array
    res.json(messagings);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

exports.getSentMessagings = async (req, res) => {
  const { userId } = req.params;
  try {
    const messagings = await Messagings.findAll({
      where: { userSent: userId },
    });
    // Use for endpoints
    // const { name } = req.body;
    // const messagings = await Messagings.findAll({ where: { name } });

    // respond with json of the public questions array
    res.json(messagings);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};

// find one messaging by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our messaging model for the messaging
  const messaging = await Messagings.findByPk(id);
  // if no messaging is found
  if (!messaging) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the messaging is found send it back.
  res.json(messaging);
};

// add a new messaging
exports.createMessaging = async (req, res) => {
  // get the name, email, message and userId values from the request body
  const {
    name, email, subject, message, messageUsersId, userSent,
  } = req.body;

  // const { userId } = req.userId;

  try {
    // create the item and save the new id
    const newMessaging = await Messagings.create({
      name, email, subject, message, messageUsersId, userSent,
    });

    // send the new id back to the request
    res.json({ id: newMessaging.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing message
exports.updateMessaging = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the message with the request body
    const [, [updatedMessagings]] = await Messagings.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated message back to the front-end
    res.json(updatedMessagings);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a message
exports.removeMessaging = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the message
  await Messagings.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
