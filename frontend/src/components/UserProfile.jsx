import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";

// API Url - points at the Express backend running in /backend (port 3000)
const spotsUrl = "http://localhost:3000/api/spots";

// UserProfile page - the account-info editing (name, email, password,
// avatar) already lives in Clerk's own UserButton menu, so this page
// doesn't duplicate that. Instead it's the app-specific dashboard: a
// bigger avatar/name, and stats computed from the user's own spots.
function UserProfile() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const [spots, setSpots] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  useEffect(function () {
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
  }, [getToken]);

  const totalLogged = spots.length;
  const uniqueBreeds = new Set(spots.map((spot) => spot.breedName)).size;
  // Spots already come back newest-first from the backend (sorted by
  // spottedTimestamp), so the most recent sighting is just the first one.
  const mostRecent = spots[0];

  return (
    <div className="page">
      {userLoaded && user ? (
        <div className="profile-header">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "Your avatar"}
              className="profile-avatar"
            />
          ) : null}
          <h1>{user.fullName || "Your Profile"}</h1>
        </div>
      ) : (
        <h1>Your Profile</h1>
      )}

      <section className="section-card section-card--teal">
        <h2>Your Stats</h2>

        {status === "loading" ? <p>Loading your stats...</p> : null}
        {status === "error" ? (
          <p>Couldn't load your stats. Try again later.</p>
        ) : null}

        {status === "loaded" ? (
          <div className="stats-grid">
            <div className="stat-tile">
              <span className="stat-number">{totalLogged}</span>
              <span className="stat-label">Dogs Logged</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">{uniqueBreeds}</span>
              <span className="stat-label">Unique Breeds</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">
                {mostRecent ? mostRecent.breedName : "—"}
              </span>
              <span className="stat-label">Most Recent Sighting</span>
            </div>
          </div>
        ) : null}

        {status === "loaded" && totalLogged === 0 ? (
          <p>
            No dogs logged yet.{" "}
            <Link to="/spot-log">Log your first sighting</Link>.
          </p>
        ) : null}
      </section>
    </div>
  );
}

export default UserProfile;
