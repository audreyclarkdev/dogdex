// Configures the Cloudinary SDK using credentials from .env. Once
// configured, any file in the app can `require` this and call
// cloudinary.uploader.upload(...) - the credentials are set globally
// on the SDK, not passed around manually.

require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
