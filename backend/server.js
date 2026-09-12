// Dependencies
// dotenv should always load first before any other dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

// Establish our db connection
require("./connections/mongoConn.js");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json()); // parse incoming json request bodies
app.use(express.urlencoded({ extended: false })); // parse URL-encoded form data
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests
// Reads CLERK_SECRET_KEY/CLERK_PUBLISHABLE_KEY from .env and attaches auth
// info to every request. Doesn't block unauthenticated requests itself -
// routes opt into requiring auth with requireAuth() (see spotRoutes.js).
app.use(clerkMiddleware());

// Routes
const spotRoutes = require("./routes/spotRoutes");
const breedRoutes = require("./routes/breedRoutes");

// Mount the spotRoutes at /api/spots
app.use("/api/spots", spotRoutes);
app.use("/api/breeds", breedRoutes);

// root route
app.get("/", (req, res) => {
  res.send("DogDex API server is running!");
});

app.listen(PORT, () => {
  console.log(`DogDex server running on port ${PORT}`);
});
