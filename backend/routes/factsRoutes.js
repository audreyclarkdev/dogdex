// General (not breed-specific) dog facts, from dogapi.dog - a separate,
// free, no-key-required API used only for this one feature. Every
// breed-specific field still comes from TheDogAPI via breedRoutes.js;
// this API is never used to look up or match against breed data, so
// the two APIs' different breed counts never come into play.
const express = require("express");
const router = express.Router();

const FACTS_API = "https://dogapi.dog/api/v2/facts";

// GET /api/facts/random - one random dog fact
router.get("/random", async (req, res) => {
  try {
    const response = await fetch(`${FACTS_API}?limit=1`);
    if (!response.ok) {
      throw new Error(`Dog facts API responded ${response.status}`);
    }

    const data = await response.json();
    const fact = data.data?.[0]?.attributes?.body || null;
    res.json({ fact });
  } catch (err) {
    console.error("GET /api/facts/random failed:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch a dog fact", error: err.message });
  }
});

module.exports = router;
