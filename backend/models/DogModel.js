const mongoose = require("mongoose");
require("../connections/mongoConn");

// 1. SCHEMA: pattern for our data
const dogSchema = new mongoose.Schema(
  {
    // TBD
  },
  { timestamps: true },
);

// 2. MODEL: handle for our collection in MongoDB
const DogModel = mongoose.model("dogs", dogSchema);

// 3. export so it may be used by server.js
module.exports = DogModel;
