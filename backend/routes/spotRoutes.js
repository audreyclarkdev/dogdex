// CRUD for spotted dogs. Mounted at /api/spots in server.js, so every
// path below is relative to that prefix.
// moving endpoints to their own routes so server.js doesn't get too long and hard to read.

const express = require("express");
const router = express.Router();

const Spot = require("../models/Spot");

// GET /api/spots - all spots
router.get("/", (req, res) => {
  Spot.find()
    .then((spots) => {
      res.json(spots);
    })
    .catch((err) => {
      console.error("GET /api/spots failed:", err);
      res
        .status(500)
        .json({ message: "Failed to fetch spots", error: err.message });
    });
});

// GET /api/spots/:id - one spot by id
router.get("/:id", (req, res) => {
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
      console.error("GET /api/spots/:id failed:", err);
      res
        .status(500)
        .json({ message: "Failed to fetch spotted dog", error: err.message });
    });
});

// POST /api/spots - log a new spot
router.post("/", (req, res) => {
  Spot.create(req.body)
    .then((newSpot) => {
      res.status(201).json(newSpot);
    })
    .catch((err) => {
      console.error("POST /api/spots failed:", err);
      res
        .status(400)
        .json({ message: "Failed to create spot", error: err.message });
    });
});

// PUT /api/spots/:id - edit a spot
router.put("/:id", (req, res) => {
  Spot.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document instead of the original
    runValidators: true, // enforce schema validation on update
  })
    .then((updatedSpot) => {
      if (!updatedSpot) {
        return res.status(404).json({
          message: `Spotted dog with id:${req.params.id} was not found!`,
        });
      }
      res.json(updatedSpot);
    })
    .catch((err) => {
      console.error("PUT /api/spots/:id failed:", err);
      res
        .status(400)
        .json({ message: "Failed to update spotted dog", error: err.message });
    });
});

// DELETE /api/spots/:id - delete a spot
router.delete("/:id", (req, res) => {
  Spot.findByIdAndDelete(req.params.id)
    .then((deletedSpot) => {
      if (!deletedSpot) {
        return res.status(404).json({
          message: `Spotted dog with id:${req.params.id} was not found!`,
        });
      }
      res.json({ message: "Spotted dog deleted", spot: deletedSpot });
    })
    .catch((err) => {
      console.error("DELETE /api/spots/:id failed:", err);
      res
        .status(500)
        .json({ message: "Failed to delete spotted dog", error: err.message });
    });
});

module.exports = router;
