import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-small">BUY • SELL • INVEST</p>

            <h1>
              Find The Right Property
              <span> For Your Future</span>
            </h1>

            <p>
              Residential plots, commercial properties and agricultural land in
              Gorakhpur.
            </p>

            <div className="hero-buttons">
              <Link to="/properties" className="primary-btn">
                Explore Properties
              </Link>

              <Link to="/find-property" className="secondary-btn">
                Find My Property
              </Link>

              <Link to="/sell-property" className="secondary-btn">
                Sell Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <p className="section-label">OUR SERVICES</p>

        <h2>Property Solutions For Everyone</h2>

        <div className="service-grid">
          <div className="service-card">
            <div className="service-icon">🏠</div>
            <h3>Residential Plots</h3>
            <p>Find the perfect location to build your dream home.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h3>Commercial Property</h3>
            <p>Premium locations for your business and investment.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🌾</div>
            <h3>Agricultural Land</h3>
            <p>Explore agricultural land opportunities around Gorakhpur.</p>
          </div>
        </div>
      </section>

      {/* SMART PROPERTY FINDER */}
      <section className="smart-finder-section">
        <div className="smart-finder-content">
          <p className="finder-tag">
            SMART PROPERTY MATCHING
          </p>

          <h2>Find Your Perfect Property</h2>

          <p className="finder-description">
            Tell us your budget, preferred location and property requirement.
            Our smart matching system will automatically find the most suitable
            properties available for you.
          </p>

          <div className="finder-features">

            <div className="finder-card">
              <span>01</span>

              <h3>Enter Your Requirement</h3>

              <p>
                Tell us your preferred location, budget, property type and area.
              </p>
            </div>

            <div className="finder-card">
              <span>02</span>

              <h3>Smart Matching</h3>

              <p>
                Our system automatically analyzes available properties based on
                your requirements.
              </p>
            </div>

            <div className="finder-card">
              <span>03</span>

              <h3>Get Best Matches</h3>

              <p>
                View suitable properties with a personalized matching score.
              </p>
            </div>

          </div>

          <Link
            to="/find-property"
            className="smart-finder-btn"
          >
            Find My Perfect Property →
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <div>
          <p className="section-label">
            WHY MAHADEV DEVELOPER?
          </p>

          <h2>Your Trust, Our Commitment</h2>

          <p>
            We help buyers and sellers connect for genuine property
            opportunities in Gorakhpur and surrounding areas.
          </p>

          <div className="features">
            <span>✓ Genuine Property Listings</span>
            <span>✓ Transparent Communication</span>
            <span>✓ Local Property Assistance</span>
            <span>✓ Buy, Sell & Investment Support</span>
          </div>
        </div>

        <div className="stats-box">
          <h3>Looking For Property?</h3>

          <p>Talk directly with Mahadev Developer.</p>

          <a href="tel:9935926414">
            +919935926414
          </a>
        </div>
      </section>

      {/* SELL PROPERTY CTA */}
      <section className="cta">
        <p>MAHADEV DEVELOPER</p>

        <h2>Have A Property To Sell?</h2>

        <p>
          List your property with us and connect with potential buyers.
        </p>

        <Link
          to="/sell-property"
          className="gold-btn"
        >
          List Your Property
        </Link>
      </section>

      {/* FOOTER */}
      <footer>
        <h2>
          MAHADEV <span>DEVELOPER</span>
        </h2>

        <p>Buy • Sell • Invest</p>

        <p>
          Gorakhpur, Uttar Pradesh - 273007 | +919935926414
        </p>

        <p className="copyright">
          © 2026 Mahadev Developer. All Rights Reserved.
        </p>
      </footer>

      {/* WHATSAPP */}
      <a
        href={`https://wa.me/919935926414?text=${encodeURIComponent(
          `Namaste Mahadev Developer,

I am interested in your property services.

Requirement: Buy / Sell Property
Preferred Location: Gorakhpur

Please contact me and share more details.

Thank you.`
        )}`}
        target="_blank"
        rel="noreferrer"
        className="whatsapp"
      >
        WhatsApp
      </a>
    </>
  );
}

export default Home;