import { useState } from "react";
import { Link } from "react-router-dom";
import pawLogo from "../assets/placeholder-logo-dog-paw-64.png";

// On smaller screens the links collapse behind a hamburger button;
// menuOpen tracks whether that dropdown is currently showing.
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Shared by every link so tapping a link on mobile closes the dropdown
  // instead of leaving it open over the page you just navigated to.
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* navbar-inner centers/caps the content width while .navbar itself
          stays full-bleed, so the white background spans the whole screen */}
      <div className="navbar-inner">
        {/* Logo doubles as the "go home" link */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <img
            src={pawLogo}
            alt="DogDex logo"
            className="brand-icon"
            width="28"
            height="28"
          />
          <span className="brand-text">DogDex</span>
        </Link>

        {/* Hamburger/close toggle - only visible below the mobile breakpoint (see App.css) */}
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            {menuOpen ? (
              // "X" icon when the menu is open
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M5 5l14 14M19 5L5 19"
              />
            ) : (
              // Three-line "hamburger" icon when the menu is closed
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* "open" class is what the mobile media query uses to reveal this
            as a dropdown; on desktop it's always visible via flex layout */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/breeds" onClick={closeMenu}>
            Breeds
          </Link>
          <Link to="/sightings" onClick={closeMenu}>
            Sightings
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
