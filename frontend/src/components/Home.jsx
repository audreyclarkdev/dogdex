import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../utils/slug";

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

  // /:id is what BreedDetail looks the breed up by; /:slug is just for a
  // readable URL (matches the pattern used in DogCard's links)
  const breedOfDayLink = breedOfDay
    ? `/breeds/${breedOfDay.id}/${slugify(breedOfDay.name)}`
    : "/breeds";

  // Only show a real number once the breeds have loaded, so the hero never
  // reads "0 breeds" while the fetch is in flight
  const breedCount =
    allBreeds.length > 0 ? allBreeds.length + " breeds" : "every breed";

  return (
    <div>
      {/* Hero: leads with the question a person actually asks on the
          sidewalk, which is also what they'd type into a search engine */}
      <section className="hero">
        <h1>What breed is that dog?</h1>
        <p className="hero-text">
          You saw it on your walk. Now find out what it was. Browse {breedCount}{" "}
          (yes, that's the official count), check off the breeds you've spotted,
          and watch your DogDex fill up! Compete with your friends for who has
          seen the most different kinds of dogs, or show up your local
          bird-watcher with a more fun hobby.
        </p>
      </section>

      <div className="page">
        {/* How it works: two separate paw trails instead of one, since
            there are two real starting points (already know the breed vs.
            need to look it up) - both end the same way, by logging the
            sighting through the form, since that's the only place a
            sighting actually gets saved right now. */}
        <section className="journey-section section-card section-card--plum">
          <h2>How it works</h2>
          <div className="journey-paths">
            <div className="journey-path">
              <h3 className="journey-path-title">Already know the breed?</h3>
              <ol className="journey-trail">
                <li>
                  <h3>Spot it</h3>
                  <p>
                    A dog trots past on the sidewalk, the trail, or at the
                    park.
                  </p>
                </li>
                <li>
                  <h3>Log it</h3>
                  <p>
                    Open Add a New Dog, pick the breed, and snap or upload a
                    photo.
                  </p>
                </li>
                <li>
                  <h3>It's collected</h3>
                  <p>Saved straight to your Dog Collection.</p>
                </li>
              </ol>
            </div>

            <div className="journey-path">
              <h3 className="journey-path-title">Not sure what breed?</h3>
              <ol className="journey-trail">
                <li>
                  <h3>Spot it</h3>
                  <p>A dog trots past and you have no idea what it is.</p>
                </li>
                <li>
                  <h3>Look it up</h3>
                  <p>
                    Browse the full breed list and open the one that matches.
                  </p>
                </li>
                <li>
                  <h3>Log it</h3>
                  <p>
                    Head to Add a New Dog with the breed confirmed.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <div className="cta-row">
          <Link to="/breeds" className="home-btn">
            Browse Breeds
          </Link>
          <Link to={breedOfDayLink} className="home-btn home-btn--secondary">
            Today's Breed
          </Link>
          <Link to="/spot-log" className="home-btn">
            Add a New Dog
          </Link>
        </div>

        {/* Breed of the Day: the daily hook, given the most prominent card
            on the page */}
        <section className="dog-card section-card section-card--teal section-card--featured">
          <h2>Breed of the Day</h2>
          {breedOfDay ? (
            <div className="breed-of-day">
              {breedOfDay.imageUrl ? (
                <img
                  src={breedOfDay.imageUrl}
                  alt={
                    breedOfDay.temperament?.length
                      ? breedOfDay.name +
                        " - " +
                        breedOfDay.temperament.join(", ")
                      : breedOfDay.name
                  }
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
            <p>
              Today's breed is still at the park.{" "}
              <Link to="/breeds">Browse breeds</Link> while you wait.
            </p>
          )}
        </section>

        {/* What's inside: written as prose so the three ideas connect,
            and so the page isn't four stacked cards in a row */}
        <section className="about-dogdex">
          <p>
            Every recognized breed lives here, with details like temperament,
            lifespan range, country of origin, dog facts, etc. Already know
            what you saw? Log it straight from the form. Not sure? Browse the
            breed list first to confirm it, then log it the same way. And
            come back every day to learn about a new featured breed. Always
            something to look at here if you're a dog lover!
          </p>
          <p className="about-dogdex-kicker">
            Part hobby tracker, part collection game.
          </p>
        </section>

        {/* Single closing action */}
        <section className="final-cta">
          <h2>Ready? Go learn about a new breed:</h2>
          <Link to="/breeds" className="home-btn">
            Browse breeds
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
