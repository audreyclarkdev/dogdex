const express = require("express");
const router = express.Router();

const DOG_API = "https://api.thedogapi.com/v1";

// API Routes:
//   GET /api/breeds         -> all breeds
//   GET /api/breeds/random  -> one breed, stable for the whole day (Breed of the Day)
//   GET /api/breeds/:id     -> one specific breed

async function callDogApi(path) {
  const response = await fetch(`${DOG_API}${path}`, {
    headers: { "x-api-key": process.env.DOG_API_KEY },
  });

  if (!response.ok) {
    throw new Error(
      `Dog API responded ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

// Helper function to reshape thedogapi breed data into a shape that our frontend expects
function reshapeBreed(breed) {
  return {
    id: breed.id,
    name: breed.name,
    temperament: breed.temperament
      ? breed.temperament.split(",").map((t) => t.trim())
      : [],
    origin: breed.origin || null,
    lifespan: breed.life_span,
    imageUrl: breed.image?.url || null,
    bredFor: breed.bred_for || null,
    breedGroup: breed.breed_group || null,
    description: breed.description || null,
    male_height_inches: breed.height?.male?.imperial || null,
    female_height_inches: breed.height?.female?.imperial || null,
    male_weight_lbs: breed.weight?.male?.imperial || null,
    female_weight_lbs: breed.weight?.female?.imperial || null,
  };
}

// GET /api/breeds - all breeds
router.get("/", async (req, res) => {
  try {
    const breeds = await callDogApi("/breeds");
    res.json(breeds.map(reshapeBreed));
  } catch (err) {
    res.status(500).json({ error: err.message, err });
  }
});

// GET /api/breeds/random - "Breed of the Day"
// Stable for the whole day: picks an index based on today's date, not a true random roll on every request.
router.get("/random", async (req, res) => {
  try {
    const breeds = await callDogApi("/breeds");
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000,
    );
    const todaysBreed = breeds[dayOfYear % breeds.length];
    res.json(reshapeBreed(todaysBreed));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/breeds/:id - one specific breed by thedogapi's numeric id
// (This is only for the live-lookup route. Your public DogDex URLs will
// eventually use the slug instead, per your earlier decision.)
router.get("/:id", async (req, res) => {
  try {
    const breed = await callDogApi(`/breeds/${req.params.id}`);
    res.json(reshapeBreed(breed));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
