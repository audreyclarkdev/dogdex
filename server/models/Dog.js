const mongoose = require('mongoose');
require('../connections/mongoConn');

// 1. SCHEMA: pattern for our data
const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 60
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// 2. MODEL: handle for our collection in MongoDB
const DogModel = mongoose.model('dogs', dogSchema);

// 3. export so it may be used by server.js
module.exports = DogModel;
