import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API Url - points at the Express backend running in /backend (port 3000)
const spotsUrl = "http://localhost:3000/api/spots";

// Dog Collection page - shows every dog sighting logged via SpotLog.
// For now this fetches ALL spots, since there's no login yet to scope it
// to one person. Once Clerk auth exists, this fetch just needs to add
// ?userId=<the logged-in user's id> - spotRoutes.js already supports
// that filter on the backend, so nothing else here has to change.
function SpotCollection() {
  const [spots, setSpots] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  useEffect(function () {
    fetch(spotsUrl)
      .then((res) => res.json())
      .then((data) => {
        setSpots(data);
        setStatus("loaded");
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
  }, []);

  // Turns an ISO date string into something readable, e.g. "Aug 4, 2026"
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="page">
      <h1>Dog Collection</h1>
      <p className="subtitle">Every dog you've spotted in the wild</p>

      <section className="section-card section-card--teal">
        {status === "loading" ? <p>Loading your collection...</p> : null}
        {status === "error" ? (
          <p>Couldn't load your collection. Try again later.</p>
        ) : null}

        {status === "loaded" && spots.length === 0 ? (
          <p>
            No dogs logged yet.{" "}
            <Link to="/spot-log">Log your first sighting</Link>.
          </p>
        ) : null}

        {spots.length > 0 ? (
          // Reuses .dog-list / .dog-info / .breed (already styled for
          // BreedList's cards) so this page's cards look consistent with
          // the rest of the app instead of introducing a second style.
          <ul className="dog-list">
            {spots.map((spot) => (
              <li key={spot._id}>
                {spot.imageUrl ? (
                  <img
                    src={spot.imageUrl}
                    alt={spot.dogName || spot.breedName}
                    className="dog-img"
                  />
                ) : null}
                <div className="dog-info">
                  {/* fall back to the breed name when no nickname was given */}
                  <h2>{spot.dogName || spot.breedName}</h2>
                  <p className="breed">{spot.breedName}</p>
                  {spot.location ? (
                    <p className="spot-location">{spot.location}</p>
                  ) : null}
                  <p className="spot-date">{formatDate(spot.spottedTimestamp)}</p>
                  {spot.notes ? <p className="spot-notes">{spot.notes}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

export default SpotCollection;
