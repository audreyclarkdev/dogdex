// Dependencies
require("dotenv").config(); // this should always load first before any other dependencies
const express = require("express");
const cors = require("cors");

// Establish our db connection
require("./connections/mongoConn.js");

const app = express();
const PORT = process.env.PORT || 3000;

const Spot = require("./models/Spot.js");

// middleware
app.use(express.json()); // parse incoming json request bodies
app.use(express.urlencoded({ extended: false })); // parse URL-encoded form data
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests

// root route
app.get("/", (req, res) => {
  res.send("DogDex API server is running!");
});

// GET - all dogs
app.get("/api/spots", (req, res) => {
  Spot.find()
    .then((spots) => {
      res.json(spots);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch all spotted dogs",
        error: err.message,
      });
    });
});

// GET - single dog by id
app.get("/api/spots/:id", (req, res) => {
  Spot.findById(req.params.id)
    .then((spot) => {
      if (!spot) {
        return res.status(404).json({
          message: `Spotted dog with id:${req.params.id} was not found!`,
        });
      }
      res.json(spot);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to fetch spotted dog", error: err.message });
    });
});

// POST - create a new dog
app.post("/api/spots", (req, res) => {
  Spot.create(req.body)
    .then((newSpot) => {
      res.status(201).json(newSpot);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Failed to create spotted dog", error: err.message });
    });
});

// PUT - update a dog
app.put("/api/spots/:id", (req, res) => {
  Spot.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document instead of the original
    runValidators: true, // Enforce schema validation on update
  })
    .then((updatedSpot) => {
      if (!updatedSpot) {
        return res
          .status(404)
          .json({
            message: `Spotted dog with id:${req.params.id} was not found!`,
          });
      }
      res.json(updatedSpot);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Failed to update spotted dog", error: err.message });
    });
});

// DELETE - remove a dog
app.delete("/api/spots/:id", (req, res) => {
  Spot.findByIdAndDelete(req.params.id)
    .then((deletedSpot) => {
      if (!deletedSpot) {
        return res
          .status(404)
          .json({
            message: `Spotted dog with id:${req.params.id} was not found!`,
          });
      }
      res.json({ message: "Spotted dog deleted", spot: deletedSpot });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to delete spotted dog", error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`DogDex server running on port ${PORT}`);
});
