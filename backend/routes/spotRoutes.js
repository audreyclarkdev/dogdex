// CRUD for spotted dogs. Mounted at /api/spots in server.js, so every
// path below is relative to that prefix.
// moving endpoints to their own routes so server.js doesn't get too long and hard to read.

const express = require("express");
const router = express.Router();

const Spot = require("../models/Spot");
const cloudinary = require("../connections/cloudinaryConn");
const { uploadSpotPhoto } = require("../middleware/upload");
const { getAuth } = require("@clerk/express");

// Sends an in-memory image buffer to Cloudinary as a base64 data URI and
// resolves with the hosted image's URL. Cloudinary's SDK accepts a data
// URI directly, so there's no need for a separate streaming library.
function uploadToCloudinary(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, { folder: "dogdex-spots" });
}

// Clerk's requireAuth() middleware is deprecated in this SDK version in
// favor of checking getAuth() manually (clerkMiddleware() in server.js
// still runs first and makes getAuth() available - this just rejects
// the request if it turns up no signed-in user). Returns the userId on
// success so callers don't have to call getAuth() a second time.
function requireUserId(req, res) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ message: "Sign in required." });
    return null;
  }
  return userId;
}

// GET /api/spots - the signed-in user's own spots, newest first (using
// the index already defined on { userId, spottedTimestamp } in the Spot
// model). The filter always comes from the verified token - never a
// client-supplied value - so one user can't view another's collection
// by editing a query param.
router.get("/", (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  Spot.find({ userId })
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

// GET /api/spots/:id - one spot by id. Used by the SpotLog edit flow,
// so it needs the same auth + ownership check as PUT/DELETE - without
// it, anyone with a spot's id could read another user's sighting.
router.get("/:id", async (req, res) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({
        message: `Spotted dog with id:${req.params.id} was not found!`,
      });
    }

    if (spot.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only view your own spots." });
    }

    res.json(spot);
  } catch (err) {
    console.error("GET /api/spots/:id failed:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch spotted dog", error: err.message });
  }
});

// POST /api/spots - log a new spot. Sent as multipart/form-data so an
// optional "photo" field can ride along with the rest of the fields;
// uploadSpotPhoto (multer) parses that into req.file before this handler runs.
router.post("/", uploadSpotPhoto, async (req, res) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    // no photo attached is a valid spot (imageUrl stays null, per the schema)
    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    } else if (req.body.imageUrl?.startsWith("http")) {
      // "Mark as Spotted" sends the breed's own TheDogAPI photo here
      // when there's no user-uploaded photo, so the collection still
      // shows a picture instead of nothing. Only used as a fallback -
      // a real uploaded photo (above) always wins.
      imageUrl = req.body.imageUrl;
    }

    // userId assigned after the spread, so it always wins over anything
    // (however unlikely) sent in the form body under the same name.
    const newSpot = await Spot.create({ ...req.body, imageUrl, userId });
    res.status(201).json(newSpot);
  } catch (err) {
    console.error("POST /api/spots failed:", err);
    res
      .status(400)
      .json({ message: "Failed to create spot", error: err.message });
  }
});

// PUT /api/spots/:id - edit a spot. Only the spot's own owner can edit
// it - fetched separately (rather than one findByIdAndUpdate) so we can
// compare userId before writing anything. Same multipart shape as POST,
// so editing can also swap the photo (uploadSpotPhoto parses "photo"
// into req.file the same way it does there).
router.put("/:id", uploadSpotPhoto, async (req, res) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({
        message: `Spotted dog with id:${req.params.id} was not found!`,
      });
    }

    if (spot.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own spots." });
    }

    if (req.file) {
      // A new photo was chosen - replace the old imageUrl. If no file
      // came through, req.body has no imageUrl key at all (the edit
      // form never sends one directly), so Object.assign below leaves
      // the existing photo untouched rather than blanking it out.
      const result = await uploadToCloudinary(req.file);
      req.body.imageUrl = result.secure_url;
    }

    Object.assign(spot, req.body);
    const updatedSpot = await spot.save();
    res.json(updatedSpot);
  } catch (err) {
    console.error("PUT /api/spots/:id failed:", err);
    res
      .status(400)
      .json({ message: "Failed to update spotted dog", error: err.message });
  }
});

// DELETE /api/spots/:id - delete a spot. Same ownership check as PUT.
router.delete("/:id", async (req, res) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({
        message: `Spotted dog with id:${req.params.id} was not found!`,
      });
    }

    if (spot.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own spots." });
    }

    await spot.deleteOne();
    res.json({ message: "Spotted dog deleted", spot });
  } catch (err) {
    console.error("DELETE /api/spots/:id failed:", err);
    res
      .status(500)
      .json({ message: "Failed to delete spotted dog", error: err.message });
  }
});

module.exports = router;
