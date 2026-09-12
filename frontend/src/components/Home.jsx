import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { slugify } from "../utils/slug";
import DogFact from "./DogFact";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

// Home page - explains what DogDex is, how to use it, main navigation,
// and previews the Breed of the Day
function Home() {
  // isSignedIn is undefined (not false) until isLoaded is true, so
  // !isSignedIn defaults to "show" while Clerk is still loading -
  // avoids briefly hiding this for an anonymous visitor.
  const { isSignedIn } = useAuth();
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
        {/* Shown to everyone regardless of sign-in state, unlike the
            onboarding copy below - trivia is fun on every visit, not
            just the first few. */}
        <DogFact />
        {/* Only useful the first few visits, before you know how DogDex
            works - hidden once signed in so returning users aren't
            re-reading the pitch every time. */}
        {!isSignedIn ? (
          <p className="hero-text">
            You saw it on your walk. Now find out what it was. Browse{" "}
            {breedCount} (yes, that's the official count), check off the breeds
            you've spotted, and watch your DogDex fill up! Compete with your
            friends for who has seen the most different kinds of dogs, or show
            up your local bird-watcher with a more fun hobby.
          </p>
        ) : null}
      </section>

      <div className="page">
        {/* How it works: two separate paw trails instead of one, since
            there are two real starting points (already know the breed vs.
            need to look it up) - both end the same way, by logging the
            sighting through the form, since that's the only place a
            sighting actually gets saved right now. Same "only useful
            before you know the app" reasoning as hero-text above. */}
        {!isSignedIn ? (
          <section className="journey-section section-card section-card--plum">
            <h2>How it works</h2>
            <div className="journey-paths">
              <div className="journey-path">
                <h3 className="journey-path-title">Already know the breed?</h3>
                <ol className="journey-trail">
                  <li>
                    <h3>Spot it</h3>
                    <p>
                      You see a dog in the distance, or walking past you on the
                      sidewalk, the trail, or at the park.
                    </p>
                  </li>
                  <li>
                    <h3>Log it</h3>
                    <p>
                      Click "Add a New Dog," pick the breed, and upload a photo.
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
                    <p>
                      A dog trots past and you have never seen that breed
                      before.
                    </p>
                  </li>
                  <li>
                    <h3>Look it up</h3>
                    <p>
                      Browse the full breed list and open the one that matches
                      the closest.
                    </p>
                  </li>
                  <li>
                    <h3>Log it</h3>
                    <p>
                      Head to "Add a New Dog" with the breed confirmed. Or click
                      on the "Mark as Spotted" button!
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        ) : null}

        <div className="cta-row">
          <Link to="/breeds" className="home-btn">
            Browse Dog Breeds
          </Link>
          <Link to="/spot-log" className="home-btn">
            Add a New Spotted Dog
          </Link>
        </div>

        {/* Breed of the Day: the daily hook, given the most prominent card
            on the page */}
        <section className="dog-card section-card section-card--brand-blue section-card--featured">
          <h2>Breed of the Day</h2>
          {breedOfDay ? (
            // The whole card is the link (not just a button inside it) -
            // gives the cursor:pointer + click-anywhere behavior asked
            // for, and avoids nesting a real <button> inside an <a>,
            // which HTML doesn't actually allow.
            <Link
              to={`/breeds/${breedOfDay.id}/${slugify(breedOfDay.name)}`}
              className="breed-of-day">
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

                {breedOfDay.origin ? (
                  <p>
                    <strong>Origin:</strong> {breedOfDay.origin}
                  </p>
                ) : null}
                {breedOfDay.breedGroup ? (
                  <p>
                    <strong>Breed group:</strong> {breedOfDay.breedGroup}
                  </p>
                ) : null}

                {/* A span (not a real button) since this whole card is
                    already the clickable link - it's a visual cue, not
                    a second interactive control. */}
                <span className="home-btn home-btn--brand-blue">
                  Click to Learn More
                </span>
              </div>
            </Link>
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
            lifespan range, country of origin, height/weight ranges, etc.
            Already know what breed you saw? Log it straight from the form. Not
            sure? Browse the breed list first to confirm it, then log it the
            same way. And come back every day to learn about a new featured
            breed. Always something to look at here if you're a dog lover!
          </p>
          <p className="about-dogdex-kicker">
            <span>Part hobby tracker, part collection game.</span>
          </p>
        </section>

        {/* Single closing action */}
        <section className="final-cta">
          <h2>Ready? Go learn about a new breed:</h2>
          <Link to="/breeds" className="home-btn">
            Browse Dog Breeds
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
