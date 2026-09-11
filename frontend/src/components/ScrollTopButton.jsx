import { useState, useEffect } from "react";

// Floating "back to top" button, shown on every page (rendered once from
// App.jsx, positioned fixed so it stays put while the page scrolls).
function ScrollTopButton() {
  // Only show the button once the user has actually scrolled down -
  // no point offering "back to top" when you're already there.
  const [visible, setVisible] = useState(false);

  useEffect(function () {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);
    // Clean up on unmount so we don't leak a listener that keeps calling
    // setState after this component is gone.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth-scrolls the whole page back to the top when clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render nothing (rather than hide with CSS) while not visible, so it
  // can't be tabbed to or clicked while off-screen.
  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top">
      {/* Simple up-arrow drawn as an SVG so it stays crisp at any size
          and inherits color via currentColor, instead of relying on a
          font's arrow glyph. */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 19V5M5 12l7-7 7 7"
        />
      </svg>
    </button>
  );
}

export default ScrollTopButton;
