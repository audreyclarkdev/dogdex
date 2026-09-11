// Mongoose Schema Blueprints for a spotted dog
const mongoose = require("mongoose");

const spotSchema = new mongoose.Schema(
  {
    // We store the id so we can look the breed up in thedogapi later
    breedId: {
      type: String,
      required: [true, "Please choose a breed."],
    },
    breedName: {
      type: String,
      required: [true, "Please choose a breed."],
      trim: true,
    },
    // optional field for dog's name or nickname
    dogName: {
      type: String,
      trim: true,
      maxlength: [50, "Name can be at most 50 characters."],
    },
    // --- Where and when ---------------------------------------------------
    // User-typed for now. Map coordinates are a stretch goal, and because
    // this is a plain string, adding coordinates later won't break anything.
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location can be at most 200 characters."],
    },

    // When the dog was SEEN. Different from createdAt, which is when the
    // user typed it in. Someone logging Saturday's walk on Monday needs both.
    spottedTimestamp: {
      type: Date,
      default: Date.now,
    },

    // Optional user observations about this sighting
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes can be at most 1000 characters."],
    },

    // Filled in later by the Upload Image ticket. Null until then.
    imageUrl: {
      type: String,
      default: null,
    },

    // --- Ownership --------------------------------------------------------
    // Clerk's user id. Not required yet so you can build and test before
    // auth exists -- flip it to required when the Clerk ticket is done.
    userId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

// Sort a user's log newest-first without scanning every document
spotSchema.index({ userId: 1, spottedTimestamp: -1 });

// naming the model "Spot" because it represents a single spotted dog
const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
