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

const allowedOrigins = [
  "https://dogdex.live",
  "https://www.dogdex.live",
  "http://localhost:5173", // keep this so local dev (Vite) still works
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, curl, or server-to-server calls)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
); // Enable Cross-Origin Resource Sharing for frontend requests

// Reads CLERK_SECRET_KEY/CLERK_PUBLISHABLE_KEY from .env and attaches auth
// info to every request. Doesn't block unauthenticated requests itself -
// routes opt into requiring auth with requireAuth() (see spotRoutes.js).
app.use(clerkMiddleware());

// Routes
const spotRoutes = require("./routes/spotRoutes");
const breedRoutes = require("./routes/breedRoutes");
const factsRoutes = require("./routes/factsRoutes");

// Mount the spotRoutes at /api/spots
app.use("/api/spots", spotRoutes);
app.use("/api/breeds", breedRoutes);
app.use("/api/facts", factsRoutes);

// root route
app.get("/", (req, res) => {
  res.send("DogDex API server is running!");
});

app.listen(PORT, () => {
  console.log(`DogDex server running on port ${PORT}`);
});
