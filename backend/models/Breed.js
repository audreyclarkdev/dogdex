const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  temperament: [String], // split into an array
  lifespan: String, // raw string from the API, e.g. "10 - 12 years"
  lifespanMin: Number, // parsed for future sort/filter
  lifespanMax: Number,
  imageUrl: String,
  bredFor: String,
  breedGroup: String,
  origin: String,
  isSpotted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Breed", breedSchema);
