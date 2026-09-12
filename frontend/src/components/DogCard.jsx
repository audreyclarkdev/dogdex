import { Link } from 'react-router-dom'
import { slugify } from '../utils/slug'

// reusable card that displays a single breed
// used by the BreedList and Home pages
function DogCard({ dog }) {
  return (
    <li className="dog-card">
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
    </li>
  )
}

export default DogCard
