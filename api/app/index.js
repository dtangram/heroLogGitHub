// load in the imports
const error = require('debug')('api:error');
const express = require('express');
const bodyParser = require('body-parser');
const morganDebug = require('morgan-debug');
const cors = require('cors');
const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// load in the user Model
const { Users } = require('./models');
// Configure dotenv to load in the .env file
require('dotenv').config();

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-east-2',

  // Local
  // accessKeyId: process.env.AWSAccessKeyId,
  // secretAccessKey: process.env.AWSSecretKey,

  // Heroku
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// routes
const collectionpublisherRouter = require('./routes/collectionpublishers');
const comicbooktitleRouter = require('./routes/comicbooktitles');
const comicbookRouter = require('./routes/comicbook');
const messagingRouter = require('./routes/messaging');
const salelistRouter = require('./routes/salelist');
const salelistALLRouter = require('./routes/salelistALL');
const wishlistRouter = require('./routes/wishlist');
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const passwordresetRouter = require('./routes/passwordreset');

// create an express app
const app = express();

// use cross origin to access token in header
app.use(cors({ credentials: true }));

// checks to see if the content-type is json and parses it into req.body
app.use(bodyParser.json());

// log all requests
app.use(morganDebug('api:request', 'dev'));// File Upload
app.post('/sign_s3', (req, res, next) => {
  // Local
  // const S3_BUCKET = process.env.Bucket;

  // Heroku
  const S3_BUCKET_NAME = process.env.S3_BUCKET;
  const s3 = new aws.S3(); // Create a new instance of S3
  const { fileName, fileType } = req.body;
  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read',
  };

  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      // console.log(err);
      res.json({ success: false, error: err });
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL
    // where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    };
    // Send it all back
    res.json({ success: true, data: { returnData } });
  });
});
// File Upload Ends

app.post('/emailpasswordreset', async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ where: { email } });

  const secret = process.env.JWT_SECRET || 'JWT SECRET';

  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: 3600,
  });

  try {
    // update the user with the request body
    const updatedUser = await Users.update({
      accesstoken: token,
      resetPasswordExpires: new Date().setTime(new Date().getTime() + (8 * 60 * 60 * 1000)),
    }, {
      // only update the row using the id in the url
      where: { email },
      // return the updated row
      returning: true,
    });

    // send the updated user back to the front-end
    res.json(updatedUser);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(400).json({ errors });
  }
  // console.log(token);

  const transportEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: 'Hero-Log',
    to: `${user.email}`,
    subject: 'Reset Password',
    text:
    `You are receiving this email because you (or someone else) have requested to reset the password for your Hero-Log account. Please click the link below or copy and paste the link into your browser: http://localhost:3000/forms/passwordreset/${token}`,
  };

  transportEmail.sendMail(mailOptions, (err) => {
    if (err) {
      // console.log('There was an error: ', err);
    } else {
      // console.log('The response is ', res);
      res.status(200).json('Recovery Email Sent');
    }
  });
});

// setup the app to use the router at /collectionpublishers
app.use('/collectionpublishers', collectionpublisherRouter);
// setup the app to use the router at /comicbooktitles
app.use('/comicbooktitles', comicbooktitleRouter);
// setup the app to use the router at /comicbooks
app.use('/comicbook', comicbookRouter);
// setup the app to use the router at /messagings
app.use('/messaging', messagingRouter);
// setup the app to use the router at /salelists
app.use('/salelist', salelistRouter);
// setup the app to use the router at /salelistsALL
app.use('/salelistALL', salelistALLRouter);
// setup the app to use the router at /wishlists
app.use('/wishlist', wishlistRouter);
// setup the app to use the router at /users
app.use('/users', usersRouter);
// setup the app to use the router at /auth
app.use('/auth', authRouter);
app.use('/passwordreset', passwordresetRouter);

// four params are required to mark this as a error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  error('ERROR FOUND:', err);
  res.sendStatus(500);
});

// export the express app
module.exports = app;
