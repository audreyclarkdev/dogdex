// All three "GET breeds" tickets live here:
//   GET /api/breeds         -> all breeds
//   GET /api/breeds/random  -> one breed, stable for the whole day (Breed of the Day)
//   GET /api/breeds/:id     -> one specific breed
//
// React never calls thedogapi directly. It only ever calls these routes.

const express = require("express");
const router = express.Router();

const DOG_API = "https://api.thedogapi.com/v1";

// ---------------------------------------------------------------------------
// Helper: talk to thedogapi
// ---------------------------------------------------------------------------
async function callDogApi(path) {
  const response = await fetch(`${DOG_API}${path}`, {
    headers: { "x-api-key": process.env.DOG_API_KEY },
  });

  if (!response.ok) {
    throw new Error(`Dog API responded ${response.status}`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Helper: reshape thedogapi's breed object into OUR shape.
//
// This is the "waiter hides the kitchen" idea. If thedogapi changes its field
// names later, you fix them HERE and the React side never notices.
//

module.exports = router;
