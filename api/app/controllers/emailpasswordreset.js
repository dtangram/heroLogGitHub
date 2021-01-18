const jwt = require('jsonwebtoken');
const { Users } = require('../models');

exports.emailpasswordreset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });

    const secret = process.env.JWT_SECRET || 'JWT SECRET';

    const token = jwt.sign({ id: user.id }, secret);

    if (!email) {
      // Return 400 error message (User doesn't exists)
      return res.status(400).send({ error: 'Email does not exist' });
    }
    return res.json({
      token, loggedIn: true, id: user.id,
    });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
