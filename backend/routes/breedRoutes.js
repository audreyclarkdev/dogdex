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
// ---------------------------------------------------------------------------
function normalizeBreed(breed) {
  return {
    id: breed.id,
    name: breed.name,
    breedGroup: breed.breed_group || "Unclassified",
    temperament: breed.temperament || "",
    lifeSpan: breed.life_span || "",
    heightInches: breed.height?.imperial || "",
    weightPounds: breed.weight?.imperial || "",
    bredFor: breed.bred_for || "",
    origin: breed.origin || breed.country_code || "",
    imageUrl: breed.reference_image_id
      ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
      : null,
  };
}

// ---------------------------------------------------------------------------
// Simple in-memory cache.
//
// The full breed list is ~170 breeds and basically never changes. Fetching it
// on every page load burns your API quota for no reason. This holds it for an
// hour. Cache resets whenever the server restarts, which is fine.
// ---------------------------------------------------------------------------
let breedCache = null;
let breedCacheTime = 0;
const CACHE_MS = 1000 * 60 * 60; // 1 hour

async function getAllBreeds() {
  const isFresh = breedCache && Date.now() - breedCacheTime < CACHE_MS;
  if (isFresh) return breedCache;

  const raw = await callDogApi("/breeds");
  breedCache = raw.map(normalizeBreed);
  breedCacheTime = Date.now();
  return breedCache;
}

// ---------------------------------------------------------------------------
// GET /api/breeds
// Ticket: "GET All Dog Breeds - Dog API"
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const breeds = await getAllBreeds();
    res.json(breeds);
  } catch (err) {
    console.error("GET /api/breeds failed:", err.message);
    res.status(502).json({ error: "Could not load dog breeds right now." });
  }
});

// ---------------------------------------------------------------------------
// GET /api/breeds/random
// Ticket: "Get Random Dog Breed - Dog API"  (Breed of the Day)
//
// ORDER MATTERS: this route MUST be declared above /:id. Express matches
// top to bottom, so if /:id came first, Express would treat the word "random"
// as an id and try to look up a breed with id "random".
//
// Also note this isn't Math.random(). The breed is derived from today's date,
// so every user sees the SAME breed all day, and it changes at midnight.
// That's what "Breed of the Day" means -- a true random would reshuffle on
// every page refresh.
// ---------------------------------------------------------------------------
router.get("/random", async (req, res) => {
  try {
    const breeds = await getAllBreeds();

    // Days since Jan 1 1970 -- a whole number that ticks up once per day.
    const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = dayNumber % breeds.length;

    res.json(breeds[index]);
  } catch (err) {
    console.error("GET /api/breeds/random failed:", err.message);
    res.status(502).json({ error: "Could not load the breed of the day." });
  }
});

// ---------------------------------------------------------------------------
// GET /api/breeds/:id
// Ticket: "GET Specific Dog Breed - Dog API"
//
// Served out of the cached list rather than a fresh API call -- it's one less
// network round trip and the data is identical.
// ---------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const breeds = await getAllBreeds();
    const breed = breeds.find((b) => String(b.id) === String(req.params.id));

    if (!breed) {
      return res.status(404).json({ error: "No breed found with that id." });
    }

    res.json(breed);
  } catch (err) {
    console.error("GET /api/breeds/:id failed:", err.message);
    res.status(502).json({ error: "Could not load that breed." });
  }
});

module.exports = router;
