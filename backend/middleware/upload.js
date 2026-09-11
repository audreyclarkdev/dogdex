// Handles pulling an uploaded photo out of a multipart form request.
// Uses memory storage (not disk) - the file only needs to live in
// memory long enough for the route to hand its buffer to Cloudinary,
// so there's no temp file to clean up afterward.
const multer = require("multer");

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Wraps multer's single-file middleware so upload errors (wrong file
// type, file too large) come back as a normal JSON error response
// instead of falling through to Express's default HTML error page.
function uploadSpotPhoto(req, res, next) {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

module.exports = { uploadSpotPhoto };
