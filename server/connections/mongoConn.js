// connects the Express app to MongoDB via mongoose

require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dogdex';

mongoose.connect(MONGODB_URI)
  .then(function () {
    console.log('MongoDB connected!');
  })
  .catch(function (err) {
    console.log('MongoDB failed to connect', err);
  });
