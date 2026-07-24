import { Link } from 'react-router-dom'

// top navigation bar - links to each page/route
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">DogDex</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/breeds">Breeds</Link>
        <Link to="/sightings">Sightings</Link>
      </div>
    </nav>
  )
}

export default Navbar
