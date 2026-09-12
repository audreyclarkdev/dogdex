import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@clerk/react";

// API Url - points at the Express backend running in /backend (port 3000)
const spotsUrl = "http://localhost:3000/api/spots";

// Tracks which breeds the signed-in user has already logged at least
// one sighting of, and exposes one-click "mark spotted" / "un-mark"
// actions. Shared between BreedList and BreedDetail so neither
// duplicates the fetch/POST/DELETE logic.
export function useSpottedBreeds() {
  const { isSignedIn, getToken } = useAuth();
  // The full spot documents, not just breed ids - unmarking a breed
  // needs to know which spot(s) to delete, not just that it's spotted.
  const [spots, setSpots] = useState([]);

  useEffect(
    function () {
      // Both branches resolve to a list of spots (or none) and set
      // state from that one place, inside a .then() - not synchronously
      // in the effect body itself, which React's linter (rightly) flags.
      const loadSpots = isSignedIn
        ? getToken().then((token) =>
            fetch(spotsUrl, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()),
          )
        : Promise.resolve([]);

      loadSpots.then(setSpots).catch((err) => console.log(err));
    },
    [isSignedIn, getToken],
  );

  const spottedIds = useMemo(
    () => new Set(spots.map((spot) => spot.breedId)),
    [spots],
  );

  // Instantly logs a bare-minimum sighting (just the breed + right now)
  // - the full SpotLog form is still there for anyone who wants to add
  // a photo/location/notes to a sighting instead. Since there's no
  // user-uploaded photo here, the breed's own TheDogAPI photo rides
  // along as a fallback so the collection still shows a picture
  // (spotRoutes.js only uses it when no real photo was uploaded).
  const markAsSpotted = useCallback(
    async (dog) => {
      const token = await getToken();
      const payload = new FormData();
      payload.append("breedId", dog.id);
      payload.append("breedName", dog.name);
      if (dog.imageUrl) {
        payload.append("imageUrl", dog.imageUrl);
      }

      const res = await fetch(spotsUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to mark this breed as spotted");
      }

      const newSpot = await res.json();
      setSpots((prev) => [newSpot, ...prev]);
    },
    [getToken],
  );

  // Un-marking deletes every sighting logged for this breed - a single
  // toggle can't represent "one of possibly several" sightings, so
  // turning it off clears the breed entirely. Callers should confirm
  // with the user first, since this can delete a sighting that had a
  // real photo/notes on it, not just an instant-marked one.
  const unmarkAsSpotted = useCallback(
    async (dog) => {
      const token = await getToken();
      const matchingSpots = spots.filter((spot) => spot.breedId === dog.id);

      const results = await Promise.all(
        matchingSpots.map((spot) =>
          fetch(`${spotsUrl}/${spot._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      if (results.some((res) => !res.ok)) {
        throw new Error("Failed to remove this breed from your spotted list");
      }

      const matchingIds = new Set(matchingSpots.map((spot) => spot._id));
      setSpots((prev) => prev.filter((spot) => !matchingIds.has(spot._id)));
    },
    [getToken, spots],
  );

  return { isSignedIn, spottedIds, markAsSpotted, unmarkAsSpotted };
}
