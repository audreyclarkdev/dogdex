import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DogCard from "./DogCard";
import DogFact from "./DogFact";
import { useSpottedBreeds } from "../hooks/useSpottedBreeds";

// API Url - points at the Express backend running in /server (port 3000)
const apiUrl = "http://localhost:3000/api/breeds";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// BreedList page - shows all breeds, with search, sort, a breed-group
// filter, an All/Spotted/Not Yet Spotted filter, and an A-Z picker that
// jumps down to where each letter starts.
function BreedList() {
  const navigate = useNavigate();
  const { isSignedIn, spottedIds, markAsSpotted, unmarkAsSpotted } =
    useSpottedBreeds();
  const [dogs, setDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc"); // name-asc | name-desc
  const [groupFilter, setGroupFilter] = useState("all");
  const [spottedFilter, setSpottedFilter] = useState("all"); // all | spotted | not-spotted
  // Set by clicking a letter; a useEffect below scrolls to it once the
  // list has re-rendered in that letter's order. A ref (not state)
  // because clearing it doesn't need to trigger a render itself.
  const pendingScrollLetterRef = useRef(null);

  useEffect(function () {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.log(err));
  }, []);

  // Every distinct breed group present in the data, for the filter dropdown
  const breedGroups = [
    ...new Set(dogs.map((dog) => dog.breedGroup).filter(Boolean)),
  ].sort();

  const visibleDogs = dogs
    .filter((dog) =>
      dog.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    )
    .filter((dog) => groupFilter === "all" || dog.breedGroup === groupFilter)
    .filter((dog) => {
      if (spottedFilter === "all") return true;
      // A signed-out visitor has spotted nothing, so "spotted" ->
      // empty, "not-spotted" -> everything. That's the correct
      // behavior, not a bug - nothing extra needed for that case.
      return spottedFilter === "spotted"
        ? spottedIds.has(dog.id)
        : !spottedIds.has(dog.id);
    })
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "name-desc" ? -comparison : comparison;
    });

  // Maps each starting letter to the index of its first breed in
  // visibleDogs, so only that one card needs an anchor id.
  const firstIndexByLetter = {};
  visibleDogs.forEach((dog, index) => {
    const letter = dog.name[0]?.toUpperCase();
    if (letter && !(letter in firstIndexByLetter)) {
      firstIndexByLetter[letter] = index;
    }
  });

  // Runs after a letter click re-sorts the list ascending - waits for
  // that re-render, then scrolls to the letter's first card.
  useEffect(
    function () {
      const letter = pendingScrollLetterRef.current;
      if (!letter) return;
      const target = document.getElementById(`letter-${letter}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingScrollLetterRef.current = null;
    },
    [visibleDogs],
  );

  // Jumping by letter only makes sense in alphabetical order, so force
  // that sort first rather than trying to make jumping work under
  // every possible sort. If it's already ascending, setSortOrder with
  // the same value wouldn't trigger a re-render at all - so the effect
  // above would never fire - hence scrolling directly in that case
  // instead of going through the ref/effect path.
  const handleLetterClick = (letter) => {
    if (sortOrder === "name-asc") {
      const target = document.getElementById(`letter-${letter}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      pendingScrollLetterRef.current = letter;
      setSortOrder("name-asc");
    }
  };

  // Signed-out visitors can browse, but marking a breed spotted is a
  // signed-in-only action (matches the rest of the app - see
  // ProtectedRoute) - send them to sign in instead of letting the
  // request 401 silently. Un-marking deletes the sighting(s) behind it,
  // so it gets a confirm - same as Delete on Dog Collection.
  const handleToggleSpotted = (dog) => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    if (spottedIds.has(dog.id)) {
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
      <h1>All Breeds</h1>
      <DogFact />

      <section className="section-card section-card--navy">
        <div className="breed-controls">
          <input
            type="text"
            className="breed-search"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            aria-label="Sort breeds">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>

          <select
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
            aria-label="Filter by breed group">
            <option value="all">All Breed Groups</option>
            {breedGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <select
            value={spottedFilter}
            onChange={(event) => setSpottedFilter(event.target.value)}
            aria-label="Filter by spotted status">
            <option value="all">All Dogs</option>
            <option value="spotted">Spotted Dogs</option>
            <option value="not-spotted">Dogs Not Seen Yet</option>
          </select>
        </div>

        <div className="alphabet-picker">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              type="button"
              disabled={!(letter in firstIndexByLetter)}
              onClick={() => handleLetterClick(letter)}>
              {letter}
            </button>
          ))}
        </div>

        {visibleDogs.length === 0 ? (
          <p>No breeds match your search.</p>
        ) : (
          <ul className="dog-list">
            {visibleDogs.map((dog, index) => {
              const letter = dog.name[0]?.toUpperCase();
              const isFirstOfLetter = firstIndexByLetter[letter] === index;
              return (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  id={isFirstOfLetter ? `letter-${letter}` : undefined}
                  isSpotted={spottedIds.has(dog.id)}
                  onToggleSpotted={handleToggleSpotted}
                />
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BreedList;
