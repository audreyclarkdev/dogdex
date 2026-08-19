const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g. "affenpinscher" - used in URLs
  name: { type: String, required: true },
  temperament: [String], // split into an array
  lifespan: String, // raw string from the API, e.g. "10 - 12 years"
  lifespanMin: Number, // parsed for future sort/filter
  lifespanMax: Number,
  imageUrl: String,
  origin: String,
});

module.exports = mongoose.model("Breed", breedSchema);
