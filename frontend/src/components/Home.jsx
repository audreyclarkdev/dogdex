import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/dogs";

// Home page - welcome message + main navigation buttons + Breed of the Day
function Home() {
  const [breedOfDay, setBreedOfDay] = useState(null);

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          // pick one dog based on the day of the month, so it changes daily
          const dayIndex = new Date().getDate() % data.length;
          setBreedOfDay(data[dayIndex]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="page">
      {/* welcome message */}
      <h1>Welcome to DogDex!</h1>
      <p className="subtitle">Discover, track, and learn about dog breeds.</p>

      {/* main navigation buttons */}
      <div className="home-buttons">
        <Link to="/breeds" className="home-btn">
          Browse Breeds
        </Link>
        {/* placeholder route until a dedicated "spot a dog" form exists */}
        <Link to="/sightings" className="home-btn">
          Spot Dog
        </Link>
        <Link to="/spotted" className="home-btn">
          My Collection
        </Link>
        <Link
          to={breedOfDay ? "/breeds/" + breedOfDay._id : "/breeds"}
          className="home-btn">
          Dog of the Day
        </Link>
      </div>

      {/* Breed of the Day preview */}
      <h2>Breed of the Day</h2>
      {breedOfDay ? (
        <div className="breed-of-day">
          {breedOfDay.image ? (
            <img
              src={breedOfDay.image}
              alt={breedOfDay.name}
              className="dog-img"
            />
          ) : null}
          <h3>{breedOfDay.name}</h3>
          <p className="breed">{breedOfDay.breed}</p>
          <Link to={"/breeds/" + breedOfDay._id}>Learn more</Link>
        </div>
      ) : (
        <p>No breeds yet. Add some through the API!</p>
      )}
    </div>
  );
}

export default Home;
