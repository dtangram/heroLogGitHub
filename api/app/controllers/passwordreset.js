const bcrypt = require('bcrypt');
const { Users } = require('../models');

exports.passwordReset = async (req, res, next) => {
  const { token } = req.params;
  // console.log('Reset Token Decoded: ', token);
  try {
    await Users.findOne({
      where: {
        accesstoken: token,
      },
    }).then((user) => {
      if (user === null) {
        // Return 400 error message (User doesn't exists)
        // console.log('Password reset link is invalid or has expired');
        res.json('Password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          // id: user.id,
          username: user.username,
          message: 'Password reset OK',
        });
      }
    });
    return res;
  } catch (err) {
    // console.log('Reset Error: ', err);
    return err;
  }
};

exports.passwordResetUpdate = async (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;
  // console.log('Update Token: ', username);

  try {
    await Users.findOne({ where: { username } })
      .then((user) => {
        if (user !== null) {
          bcrypt.hash(password, 10)
            .then((hash) => {
              user.update({
                password: hash,
                where: { username },
                returning: true,
                accesstoken: null,
              });
            })
            .then(() => {
              res.status(200).json('password updated');
            });
        } else {
          // console.log('User does not exist');
          res.status(404).json('User does not exist');
        }
      });
    return res;
  } catch (err) {
    // map the errors messages to send them back
    // console.log('Update Error: ', err);
    return err;
  }
};
