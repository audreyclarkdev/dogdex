import { useState, useEffect } from "react";
import { API_URL } from "../config";

// Random dog facts endpoint on the Express backend (base URL set in config.js)
const factsUrl = `${API_URL}/api/facts/random`;

// "Did you know?" blurb - one random, general (not breed-specific) dog
// fact, shared between Home and BreedList rather than duplicating the
// fetch in both. Renders nothing while loading or if the fetch fails,
// since a missing trivia blurb isn't worth an error message.
function DogFact() {
  const [fact, setFact] = useState(null);

  useEffect(function () {
    fetch(factsUrl)
      .then((res) => res.json())
      .then((data) => setFact(data.fact))
      .catch((err) => console.log(err));
  }, []);

  if (!fact) return null;

  return (
    <p className="dog-fact">
      <strong>Did you know?</strong> {fact}
    </p>
  );
}

export default DogFact;
