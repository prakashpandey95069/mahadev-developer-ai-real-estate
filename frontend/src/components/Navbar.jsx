import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <span>MAHADEV</span>
        <small>DEVELOPER</small>
      </Link>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/properties" onClick={closeMenu}>
          Properties
        </Link>
        <Link to="/sell-property" onClick={closeMenu}>
          Sell Property
        </Link>
        
        <Link to="/property-map">Property Map</Link>
        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>

      <div className="navbar-actions">
        <a href="tel:9935926414" className="call-btn">
          Call Now
        </a>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
