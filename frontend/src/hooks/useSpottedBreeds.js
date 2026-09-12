import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/react";

// API Url - points at the Express backend running in /backend (port 3000)
const spotsUrl = "http://localhost:3000/api/spots";

// Tracks which breeds the signed-in user has already logged at least
// one sighting of, and exposes a one-click "instant log" action for
// marking a new one. Shared between BreedList and BreedDetail so
// neither duplicates the fetch/POST logic.
export function useSpottedBreeds() {
  const { isSignedIn, getToken } = useAuth();
  const [spottedIds, setSpottedIds] = useState(new Set());

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

      loadSpots
        .then((spots) => {
          setSpottedIds(new Set(spots.map((spot) => spot.breedId)));
        })
        .catch((err) => console.log(err));
    },
    [isSignedIn, getToken],
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

      setSpottedIds((prev) => new Set(prev).add(dog.id));
    },
    [getToken],
  );

  return { isSignedIn, spottedIds, markAsSpotted };
}
