const axios = require('axios');
// const error = require('debug')('api:error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../models');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ where: { username } });
    const result = await bcrypt.compare(password, user.password);

    // if (username === user.username && result) {
    //   console.log('Looged In!');
    // }

    if (!user || !result) {
      // Return 400 error message (User doesn't exists)
      return res.status(400).send({ error: 'User does not exist' });
    }

    const secret = process.env.JWT_SECRET || 'JWT SECRET';

    // Fixer API
    const url = 'http://data.fixer.io/api/latest?access_key=38f19fa0be4e3e2be7c164a3e024fb26';

    const { data } = await axios({
      method: 'get',
      url,
      params: {
        secret,
      },
    });
    //

    const token = jwt.sign({ id: user.id }, secret);
    return res.json({
      token, loggedIn: true, id: user.id, data,
    });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

exports.googleLogin = async (req, res) => {
  // pull the code out of the body
  const { tokenId, email } = req.body;

  try {
    // console.log('ID Token: ', tokenId);
    const user = await Users.findOne({ where: { email } });

    // console.log('USER 1: ', user.email);

    if (!user) {
      // Return 400 error message (User doesn't exists)
      return res.status(400).send({ error: 'User does not exist' });
    }

    const secret = process.env.JWT_SECRET || 'JWT SECRET';

    // Fixer API
    const url = 'http://data.fixer.io/api/latest?access_key=38f19fa0be4e3e2be7c164a3e024fb26';

    const { data } = await axios({
      method: 'get',
      url,
      params: {
        secret,
      },
    });
    //

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: 3600,
    });

    res.json({
      token, loggedIn: true, id: user.id, data,
    });

    return tokenId;
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
