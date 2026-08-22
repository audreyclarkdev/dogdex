import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

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
        {/* Logo doubles as the "go home" link. Wordmark + paw flourish,
            from the DogDex logo direction (Fraunces "Dog" + italic "Dex"). */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-word">
            <span className="brand-dog">Dog</span>
            <span className="brand-dex">Dex</span>
          </span>
          <span className="brand-flourish" aria-hidden="true">
            <span className="brand-rule" />
            <svg
              className="brand-paw"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor">
              <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
              <ellipse
                cx="5.6"
                cy="9.8"
                rx="2.1"
                ry="2.7"
                transform="rotate(-18 5.6 9.8)"
              />
              <ellipse
                cx="18.4"
                cy="9.8"
                rx="2.1"
                ry="2.7"
                transform="rotate(18 18.4 9.8)"
              />
              <ellipse
                cx="9.3"
                cy="5.8"
                rx="1.8"
                ry="2.3"
                transform="rotate(-10 9.3 5.8)"
              />
              <ellipse
                cx="14.7"
                cy="5.8"
                rx="1.8"
                ry="2.3"
                transform="rotate(10 14.7 5.8)"
              />
            </svg>
            <span className="brand-rule" />
          </span>
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
            as a dropdown; on desktop it's always visible via flex layout.
            NavLink (instead of Link) knows which route is active so we can
            style the current page's link differently - see .nav-links
            a.active in App.css. `end` on Home keeps it from matching every
            route, since "/" is technically a prefix of all of them. */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/breeds" onClick={closeMenu}>
            Breeds
          </NavLink>
          <NavLink to="/spotted" onClick={closeMenu}>
            My Collection
          </NavLink>
          <NavLink to="/userprofile" onClick={closeMenu}>
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
