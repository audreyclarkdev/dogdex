import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSpottedBreeds } from "../hooks/useSpottedBreeds";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// BreedDetail page - shows a single dog by its id (from the URL)
function BreedDetail() {
  // grab the :id from the route (/breeds/:id)
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, spottedIds, markAsSpotted, unmarkAsSpotted } =
    useSpottedBreeds();
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

  if (!dog) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  const isSpotted = spottedIds.has(dog.id);

  // Un-marking deletes the sighting(s) behind it, so it gets a confirm
  // - same as Delete on Dog Collection.
  const handleToggleSpotted = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    if (isSpotted) {
      if (
        !window.confirm(
          `Remove ${dog.name} from your spotted list? This deletes any sightings you've logged for this breed.`,
        )
      ) {
        return;
      }
      unmarkAsSpotted(dog).catch((err) => console.log(err));
    } else {
      markAsSpotted(dog).catch((err) => console.log(err));
    }
  };

  return (
    <div className="page">
      <Link to="/breeds" className="home-btn home-btn--compact">
        <span className="back-arrow">&larr;</span> Back to all breeds
      </Link>
      <h1>{dog.name}</h1>

      <section className="section-card section-card--brand-blue">
        <button
          type="button"
          className={
            isSpotted
              ? "mark-spotted-btn mark-spotted-btn--detail spotted"
              : "mark-spotted-btn mark-spotted-btn--detail"
          }
          onClick={handleToggleSpotted}>
          {isSpotted ? "✓ Spotted" : "Mark as Spotted"}
        </button>

        {dog.imageUrl ? (
          // No .dog-img here on purpose - that class forces every image
          // into a fixed, cropped 260px box (see App.css), which is
          // exactly what this page shouldn't do. Sized via .detail-img
          // (width: 70%, height: auto) instead.
          <img
            src={dog.imageUrl}
            alt={dog.name}
            width={dog.imageWidth}
            height={dog.imageHeight}
            className="detail-img"
          />
        ) : null}

        <div className="detail-info">
          {dog.temperament?.length ? (
            <p>
              <strong>Temperament:</strong> {dog.temperament.join(", ")}
            </p>
          ) : null}
          {dog.lifespan ? (
            <p>
              <strong>Lifespan:</strong> {dog.lifespan}
            </p>
          ) : null}
          {dog.origin ? (
            <p>
              <strong>Origin:</strong> {dog.origin}
            </p>
          ) : null}
          {dog.bredFor ? (
            <p>
              <strong>Bred for:</strong> {dog.bredFor}
            </p>
          ) : null}
          {dog.breedGroup ? (
            <p>
              <strong>Breed group:</strong> {dog.breedGroup}
            </p>
          ) : null}
          {dog.heightInches ? (
            <p>
              <strong>Height:</strong> {dog.heightInches} in
            </p>
          ) : null}
          {dog.weightLbs ? (
            <p>
              <strong>Weight:</strong> {dog.weightLbs} lbs
            </p>
          ) : null}
          {dog.description ? (
            <p>
              <strong>About:</strong> {dog.description}
            </p>
          ) : null}
          {dog.history ? (
            <p>
              <strong>History:</strong> {dog.history}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default BreedDetail;
