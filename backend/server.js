// Dependencies
require("dotenv").config(); // this should always load first before any other dependencies
const express = require("express");
const cors = require("cors");

// Establish our db connection
require("./connections/mongoConn.js");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json()); // parse incoming json request bodies
app.use(express.urlencoded({ extended: false })); // parse URL-encoded form data
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests

// Routes
const spotRoutes = require("./routes/spotRoutes");
// Mount the spotRoutes at /api/spots
app.use("/api/spots", spotRoutes);

// root route
app.get("/", (req, res) => {
  res.send("DogDex API server is running!");
});

app.listen(PORT, () => {
  console.log(`DogDex server running on port ${PORT}`);
});
