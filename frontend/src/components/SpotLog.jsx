import { useState, useEffect } from "react";
import DogCard from "./DogCard";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// Spot Log page - shows the dogs the user has "spotted"
// NOTE: this currently reuses the /dogs data and treats isFavorite as "spotted".
// When you add a dedicated Spotted model/endpoint (photo, location, date, notes),
// point the fetch below at that route instead.
function SpotLog() {
  const [dogs, setDogs] = useState([]);

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.log(err));
  }, []);

  const spotted = dogs.filter((dog) => dog.isFavorite === true);

  return (
    <div className="page">
      <h1>Dog Log</h1>
      <p className="subtitle">Dogs you've spotted in the wild</p>

      <section className="section-card section-card--plum">
        {spotted.length === 0 ? (
          <p>You haven't spotted any dogs yet. Check off ones you've seen!</p>
        ) : (
          <ul className="dog-list">
            {spotted.map((dog, index) => (
              <DogCard key={index} dog={dog} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SpotLog;
