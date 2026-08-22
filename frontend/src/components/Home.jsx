import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/dogs";

// Home page - explains what DogDex is, how to use it, main navigation,
// and previews the Breed of the Day
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
    <div>
      {/* Hero: what the app is, in one breath */}
      <section className="hero">
        <h1>
          Discover, track, and learn about dog breeds &mdash; one spot at a
          time.
        </h1>
        <p className="eyebrow">
          Part field guide, part journal, part collection game
        </p>
        <p className="hero-text">
          DogDex turns every dog you notice on a walk into a moment of
          discovery. Browse a full encyclopedia of breeds, look up the ones you
          run into, and mark them as spotted to build a personal collection of
          real-world sightings.
        </p>
        <p className="tagline">Spot & Collect them all!</p>
      </section>

      <div className="page">
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

        {/* How it works */}
        <section className="journey-section">
          <h2>How it works</h2>
          <div className="journey-grid">
            <article className="journey-step">
              <span>1</span>
              <h3>Spot a dog</h3>
              <p>Notice a breed on the sidewalk, at the park, or on a trip.</p>
            </article>
            <article className="journey-step">
              <span>2</span>
              <h3>Look it up</h3>
              <p>
                Browse the breed list and open its profile to confirm what you
                saw.
              </p>
            </article>
            <article className="journey-step">
              <span>3</span>
              <h3>Mark it spotted</h3>
              <p>Add it to My Collection so it's saved to your growing list.</p>
            </article>
            <article className="journey-step">
              <span>4</span>
              <h3>Come back tomorrow</h3>
              <p>Check the Dog of the Day and keep building your collection.</p>
            </article>
          </div>
        </section>

        {/* What you can do */}
        <section className="feature-section">
          <h2>What's inside</h2>
          <div className="feature-grid">
            <article className="feature-card feature-plum">
              <h3>Breed encyclopedia</h3>
              <p>
                Browse a full list of dog breeds with photos and details, pulled
                from TheDogAPI.
              </p>
            </article>
            <article className="feature-card feature-teal">
              <h3>Breed profiles</h3>
              <p>
                Open any breed to see what makes it stand out before you decide
                it's "the one" you spotted.
              </p>
            </article>
            <article className="feature-card feature-coral">
              <h3>Spot &amp; collect</h3>
              <p>
                Mark breeds as spotted and watch My Collection grow every time
                you're out and about.
              </p>
            </article>
            <article className="feature-card feature-navy">
              <h3>Dog of the Day</h3>
              <p>
                A new featured breed every day &mdash; a small reason to open
                the app and learn something.
              </p>
            </article>
          </div>
        </section>

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
    </div>
  );
}

export default Home;
