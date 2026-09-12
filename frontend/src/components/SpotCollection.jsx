import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";

// API Url - points at the Express backend running in /backend (port 3000)
const spotsUrl = "http://localhost:3000/api/spots";

// Dog Collection page - shows every dog sighting the signed-in user has
// logged via SpotLog. Only reachable signed in (see ProtectedRoute in
// App.jsx); the backend derives which user's spots to return from the
// Authorization token itself, not anything the frontend passes.
function SpotCollection() {
  const { getToken } = useAuth();
  const [spots, setSpots] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | loaded | error
  // Tracks which spot is mid-delete, so only that card's button shows
  // "Deleting..." instead of freezing the whole page.
  const [deletingId, setDeletingId] = useState(null);

  useEffect(
    function () {
      getToken()
        .then((token) =>
          fetch(spotsUrl, { headers: { Authorization: `Bearer ${token}` } }),
        )
        .then((res) => res.json())
        .then((data) => {
          setSpots(data);
          setStatus("loaded");
        })
        .catch((err) => {
          console.log(err);
          setStatus("error");
        });
    },
    [getToken],
  );

  const handleDelete = (spot) => {
    const label = spot.dogName || spot.breedName;
    if (
      !window.confirm(`Delete this record of ${label}? This can't be undone.`)
    ) {
      return;
    }

    setDeletingId(spot._id);
    getToken()
      .then((token) =>
        fetch(`${spotsUrl}/${spot._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete this sighting.");
        setSpots((prev) => prev.filter((s) => s._id !== spot._id));
      })
      .catch((err) => {
        console.log(err);
        window.alert("Couldn't delete this sighting. Try again.");
      })
      .finally(() => setDeletingId(null));
  };

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
      <p className="subtitle">Every dog you've spotted and logged!</p>

      <section className="section-card section-card--teal">
        {status === "loading" ? <p>Loading your collection...</p> : null}
        {status === "error" ? (
          <p>Couldn't load your collection. Try again later.</p>
        ) : null}

        {status === "loaded" && spots.length === 0 ? (
          <p>
            No dogs logged yet. <Link to="/spot-log">Log your first dog!</Link>
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
                  <p className="spot-date">
                    {formatDate(spot.spottedTimestamp)}
                  </p>
                  {spot.notes ? (
                    <p className="spot-notes">{spot.notes}</p>
                  ) : null}

                  <div className="dog-actions">
                    <Link to={`/spot-log/${spot._id}`}>Edit</Link>
                    <button
                      type="button"
                      className="delete-btn"
                      disabled={deletingId === spot._id}
                      onClick={() => handleDelete(spot)}>
                      {deletingId === spot._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
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
