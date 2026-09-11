// CRUD for spotted dogs. Mounted at /api/spots in server.js, so every
// path below is relative to that prefix.
// moving endpoints to their own routes so server.js doesn't get too long and hard to read.

const express = require("express");
const router = express.Router();

const Spot = require("../models/Spot");
const cloudinary = require("../connections/cloudinaryConn");
const { uploadSpotPhoto } = require("../middleware/upload");

// Sends an in-memory image buffer to Cloudinary as a base64 data URI and
// resolves with the hosted image's URL. Cloudinary's SDK accepts a data
// URI directly, so there's no need for a separate streaming library.
function uploadToCloudinary(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, { folder: "dogdex-spots" });
}

// GET /api/spots - all spots, or one user's spots via ?userId=...
// (no auth yet, so the frontend can't actually pass a real userId until
// Clerk is wired up - this just makes that a query-param change later
// instead of a route rewrite). Newest sighting first, using the index
// already defined on { userId, spottedTimestamp } in the Spot model.
router.get("/", (req, res) => {
  const filter = {};
  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  Spot.find(filter)
    .sort({ spottedTimestamp: -1 })
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

// POST /api/spots - log a new spot. Sent as multipart/form-data so an
// optional "photo" field can ride along with the rest of the fields;
// uploadSpotPhoto (multer) parses that into req.file before this handler runs.
router.post("/", uploadSpotPhoto, async (req, res) => {
  try {
    // no photo attached is a valid spot (imageUrl stays null, per the schema)
    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const newSpot = await Spot.create({ ...req.body, imageUrl });
    res.status(201).json(newSpot);
  } catch (err) {
    console.error("POST /api/spots failed:", err);
    res
      .status(400)
      .json({ message: "Failed to create spot", error: err.message });
  }
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
