import { Link } from 'react-router-dom'

// reusable card that displays a single dog
// used by the BreedList and Home pages
function DogCard({ dog }) {
  return (
    <li className={dog.isFavorite ? 'dog-card favorite' : 'dog-card'}>
      <Link to={'/breeds/' + dog._id} className="dog-card-link">
        {dog.image ? <img src={dog.image} alt={dog.name} className="dog-img" /> : null}
        <div className="dog-info">
          <h2>{dog.name}</h2>
          <p className="breed">{dog.breed}</p>
        </div>
      </Link>
    </li>
  )
}

export default DogCard
