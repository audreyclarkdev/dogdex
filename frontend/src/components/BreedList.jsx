import { useState, useEffect } from "react";
import DogCard from "./DogCard";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// BreedList page - shows all dogs with a filter
function BreedList() {
  const [dogs, setDogs] = useState([]);
  // filter can be: 'all' | 'spotted' | 'notSpotted'
  // (uses the isFavorite field on the Dog model as the "spotted" flag)
  const [filter, setFilter] = useState("all");

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.log(err));
  }, []);

  // apply the current filter to the dogs list
  const visibleDogs = dogs.filter((dog) => {
    if (filter === "spotted") return dog.isFavorite === true;
    if (filter === "notSpotted") return dog.isFavorite !== true;
    return true;
  });

  return (
    <div className="page">
      <h1>All Breeds</h1>

      <section className="section-card section-card--navy">
        <div className="filters">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}>
            All
          </button>
          <button
            onClick={() => setFilter("spotted")}
            className={filter === "spotted" ? "active" : ""}>
            Spotted
          </button>
          <button
            onClick={() => setFilter("notSpotted")}
            className={filter === "notSpotted" ? "active" : ""}>
            Not Yet Spotted
          </button>
        </div>

        {visibleDogs.length === 0 ? (
          <p>No dogs to show.</p>
        ) : (
          <ul className="dog-list">
            {visibleDogs.map((dog, index) => (
              <DogCard key={index} dog={dog} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BreedList;
