import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// Home page - explains what DogDex is, how to use it, main navigation,
// and previews the Breed of the Day
function Home() {
  const [allBreeds, setAllBreeds] = useState([]);
  const [breedOfDay, setBreedOfDay] = useState(null);

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setAllBreeds(data);
        if (data.length > 0) {
          // pick one dog based on the day of the month, so it changes daily
          const dayIndex = new Date().getDate() % data.length;
          setBreedOfDay(data[dayIndex]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const breedOfDayLink = breedOfDay ? "/breeds/" + breedOfDay._id : "/breeds";

  return (
    <div>
      {/* Hero: what the app is, plus a CTA so the main action is visible
          without scrolling */}
      <section className="hero">
        <h1>
          The dog-spotting app that turns every walk into a collectible
          adventure in your own community.
        </h1>
        <p className="hero-text">
          Inspired by bird-watching and the classic Pokédex loop, DogDex turns
          dog encounters into moments of discovery. The goal is simple: notice
          more, learn more, and build a personal collection of real-world
          sightings.
        </p>

        <div className="cta-row">
          <Link to="/breeds" className="home-btn">
            Browse Breeds
          </Link>
          <Link to={breedOfDayLink} className="home-btn home-btn--secondary">
            See Today's Breed
          </Link>
        </div>
      </section>

      <div className="page">
        {/* How to use DogDex: the four-step loop, explained immediately so a
            first-time visitor knows what to do before anything else */}
        <section className="journey-section section-card section-card--teal">
          <h2>How to use DogDex</h2>
          <p className="section-intro">Four steps to start your collection:</p>
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
                Search Browse Breeds and open its profile to confirm what you
                saw.
              </p>
            </article>
            <article className="journey-step">
              <span>3</span>
              <h3>Mark it spotted</h3>
              <p>Tap "Mark as Spotted" to add it to My Collection.</p>
            </article>
            <article className="journey-step">
              <span>4</span>
              <h3>Come back tomorrow</h3>
              <p>Check the Breed of the Day below and keep collecting!</p>
            </article>
          </div>
        </section>

        {/* Breed of the Day: the daily hook, given the most prominent card
            on the page */}
        <section className="dog-card section-card section-card--brand-blue section-card--featured">
          <h2>Breed of the Day</h2>
          {breedOfDay ? (
            <div className="breed-of-day">
              {breedOfDay.imageUrl ? (
                <img
                  src={breedOfDay.imageUrl}
                  alt={breedOfDay.name}
                  className="dog-img"
                />
              ) : null}
              <div className="breed-of-day-info">
                <h3 className="breed">{breedOfDay.name}</h3>
                <ul className="temperament">
                  {breedOfDay.temperament?.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No breeds yet. Add some through the API!</p>
          )}
        </section>

        {/* What you can do */}
        <section className="feature-section section-card section-card--plum">
          <h2>What's inside</h2>
          <p className="section-intro">
            Everything you need to build your collection:
          </p>
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

        {/* Quick links to every part of the app */}
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
          <Link to={breedOfDayLink} className="home-btn">
            Dog of the Day
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
