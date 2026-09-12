import { Link } from 'react-router-dom'
import { slugify } from '../utils/slug'

// reusable card that displays a single breed
// used by the BreedList and Home pages
function DogCard({ dog, id, isSpotted, onToggleSpotted }) {
  return (
    // id is set by BreedList on the first card of each letter, giving
    // the alphabet picker a real element to scroll to (see BreedList.jsx)
    <li className={isSpotted ? "dog-card spotted" : "dog-card"} id={id}>
      {/* /:id is what BreedDetail actually looks the breed up by;
          /:slug just makes the URL human-readable */}
      <Link to={`/breeds/${dog.id}/${slugify(dog.name)}`} className="dog-card-link">
        {dog.imageUrl ? <img src={dog.imageUrl} alt={dog.name} className="dog-img" /> : null}
        <div className="dog-info">
          <h2>{dog.name}</h2>
          {/* Same temperament tag treatment as Breed of the Day - see
              the un-scoped .temperament rules in App.css. */}
          <ul className="temperament">
            {dog.temperament?.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        </div>
      </Link>

      {/* Sibling of the Link above, not nested inside it - a <button>
          isn't valid HTML inside an <a>, and this needs its own click
          behavior (instant-log/un-log) instead of navigating anywhere. */}
      {onToggleSpotted ? (
        <button
          type="button"
          className={isSpotted ? "mark-spotted-btn spotted" : "mark-spotted-btn"}
          onClick={() => onToggleSpotted(dog)}>
          {isSpotted ? "✓ Spotted" : "Mark as Spotted"}
        </button>
      ) : null}
    </li>
  )
}

export default DogCard
