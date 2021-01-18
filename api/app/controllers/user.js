const bcrypt = require('bcrypt');
// load in the user Model
const { Users } = require('../models');

exports.getUser = async (req, res) => {
  // run the find all function on the model
  const { userId } = req.params;
  const userUsers = await Users.findAll({ where: { id: userId } });
  // respond with json of the user array
  res.json(userUsers);
};

// get all the users with a type of regular
exports.getRegular = async (req, res) => {
  // run the find all function on the model
  const regularUsers = await Users.findAll({ where: { type: 'regular' } });
  // respond with json of the regular array
  res.json(regularUsers);
};

// get all the users with a type of fixer
exports.getFixer = async (req, res) => {
  // run the find all function on the model
  const fixerUsers = await Users.findAll({ where: { type: 'fixer' } });
  // respond with json of the fixer array
  res.json(fixerUsers);
};

// find one user by id
exports.getOneById = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // search our user model for the user
  const user = await Users.findByPk(id);
  // if no user is found
  if (!user) {
    // return a 404 (not found) code
    res.sendStatus(404);
    return;
  }

  // if the user is found send it back.
  res.json(user);
};

// add a new user
exports.createUser = async (req, res) => {
  // get the username, email, password and type values from the request body
  const {
    username, firstname, lastname, email, accesstoken, type,
  } = req.body;

  // const { userId } = req.params;
  // Validate Users
  // If the validation fails, return 400 with an error message
  try {
    // generate number of rounds for salt for bcrypt
    const saltRounds = await bcrypt.genSalt(10);

    // create hash variable to by passing the password input and salt variable
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    // use hook to store hash in password input (req.body.password)

    // const password = Users.beforeCreate(hash);

    // create the item and save the new id
    const newUsers = Users.create({
      username,
      firstname,
      lastname,
      email,
      password: hash,
      accesstoken,
      type,
      // userId,
    });

    // send the new id back to the request
    res.json({ id: newUsers.id });
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// update an existing user
exports.updateUser = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;

  try {
    // update the user with the request body
    const [, [updatedUsers]] = await Users.update(req.body, {
      // only update the row using the id in the url
      where: { id },
      // return the updated row
      returning: true,
    });

    // send the updated user back to the front-end
    res.json(updatedUsers);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
};

// delete a user
exports.removeUser = async (req, res) => {
  // get the id from the url params
  const { id } = req.params;
  // remove the user
  await Users.destroy({ where: { id } });
  // send a good status code
  res.sendStatus(200);
};
