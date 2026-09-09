import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/breeds";

// BreedDetail page - shows a single dog by its id (from the URL)
function BreedDetail() {
  // grab the :id from the route (/breeds/:id)
  const { id } = useParams();
  const [dog, setDog] = useState(null);

  useEffect(
    function () {
      fetch(apiUrl + "/" + id)
        .then((res) => res.json())
        .then((data) => setDog(data))
        .catch((err) => console.log(err));
    },
    // re-run if the id in the url changes
    [id],
  );

  // crUd - UPDATE: toggle whether this dog is spotted/favorite
  const handleFavorite = () => {
    fetch(apiUrl + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !dog.isFavorite }),
    })
      .then((res) => res.json())
      .then((updatedDog) => setDog(updatedDog))
      .catch((err) => console.error(err));
  };

  if (!dog) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/breeds">&larr; Back to all breeds</Link>
      <h1>{dog.name}</h1>

      <section className="section-card section-card--brand-blue">
        {dog.image ? (
          <img src={dog.image} alt={dog.name} className="dog-img detail-img" />
        ) : null}

        <div className="detail-info">
          <p>
            <strong>Breed:</strong> {dog.breed}
          </p>
          {dog.age ? (
            <p>
              <strong>Age:</strong> {dog.age}
            </p>
          ) : null}
          {dog.description ? (
            <p>
              <strong>About:</strong> {dog.description}
            </p>
          ) : null}
        </div>

        <button className="spot-toggle" onClick={handleFavorite}>
          {dog.isFavorite ? "★ Spotted" : "☆ Mark as Spotted"}
        </button>
      </section>
    </div>
  );
}

export default BreedDetail;
