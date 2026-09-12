import { useState, useEffect } from "react";
import DogCard from "./DogCard";
import DogFact from "./DogFact";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// BreedList page - shows all breeds
// An All / Spotted / Not Yet Spotted filter can come back here once
// UserProfile can fetch the user's Spot records, by checking whether a
// breed's id shows up among the user's spots.
function BreedList() {
  const [dogs, setDogs] = useState([]);

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="page">
      <h1>All Breeds</h1>
      <DogFact />

      <section className="section-card section-card--navy">
        {dogs.length === 0 ? (
          <p>No dogs to show.</p>
        ) : (
          <ul className="dog-list">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BreedList;
