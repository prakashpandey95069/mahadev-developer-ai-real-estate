import { useState } from "react";
import axios from "axios";

function FindProperty() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    propertyType: "",
    budget: "",
    minArea: "",
    maxArea: "",
  });

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSearched(false);
      setMatches([]);

      // Buyer requirement save karo
      const buyerResponse = await axios.post(
        "http://localhost:5000/api/buyers",
        {
          ...form,
          budget: Number(form.budget),
          minArea: Number(form.minArea) || 0,
          maxArea: Number(form.maxArea) || 0,
        }
      );

      const buyerId =
        buyerResponse.data.buyer._id;

      // Matching properties fetch karo
      const matchResponse = await axios.get(
        `http://localhost:5000/api/buyers/${buyerId}/matches`
      );

      setMatches(
        matchResponse.data.matches || []
      );

      setSearched(true);

    } catch (error) {
      console.error(
        "Property Matching Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to find properties."
      );

    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (property) => {
    const message = `
Hello Mahadev Developer,

I am interested in this property.

Property: ${property.title}
Location: ${property.location}
Price: ₹${Number(property.price).toLocaleString("en-IN")}
Area: ${property.area} Sq. Ft.
Match Score: ${property.matchScore}%

Please share more details about this property.
`;

    const url =
      `https://wa.me/919935926414?text=${encodeURIComponent(
        message
      )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="find-property-page">

      <div className="find-property-container">

        <div className="find-property-heading">
          <span>SMART PROPERTY MATCHING</span>

          <h1>Find Your Perfect Property</h1>

          <p>
            Tell us your requirements and our smart
            matching system will find suitable properties
            for you.
          </p>
        </div>

        <form
          className="buyer-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Preferred Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Property Type
            </option>

            <option value="Residential Plot">
              Residential Plot
            </option>

            <option value="House">
              House
            </option>

            <option value="Commercial Property">
              Commercial Property
            </option>

            <option value="Agricultural Land">
              Agricultural Land
            </option>
          </select>

          <input
            type="number"
            name="budget"
            placeholder="Maximum Budget (₹)"
            value={form.budget}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="number"
            name="minArea"
            placeholder="Minimum Area (Sq. Ft.)"
            value={form.minArea}
            onChange={handleChange}
            min="0"
          />

          <input
            type="number"
            name="maxArea"
            placeholder="Maximum Area (Sq. Ft.)"
            value={form.maxArea}
            onChange={handleChange}
            min="0"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Finding Best Properties..."
              : "Find Matching Properties"}
          </button>
        </form>

        {error && (
          <div className="matching-error">
            {error}
          </div>
        )}

        {searched && (
          <div className="matching-results">

            <div className="results-heading">
              <h2>
                Recommended Properties
              </h2>

              <p>
                {matches.length} matching properties found
              </p>
            </div>

            {matches.length === 0 ? (
              <div className="no-matches">
                <h3>No suitable property found</h3>

                <p>
                  We have saved your requirement. Our team
                  can contact you when a matching property
                  becomes available.
                </p>
              </div>
            ) : (
              <div className="matching-property-grid">

                {matches.map((property) => (
                  <div
                    className="matching-property-card"
                    key={property._id}
                  >
                    {property.image && (
                      <img
                        src={property.image}
                        alt={property.title}
                      />
                    )}

                    <div className="match-score">
                      {property.matchScore}% Match
                    </div>

                    <div className="matching-card-content">

                      <span className="property-type">
                        {property.propertyType}
                      </span>

                      <h3>
                        {property.title}
                      </h3>

                      <p>
                        {property.location}
                      </p>

                      <div className="matching-price">
                        ₹
                        {Number(
                          property.price
                        ).toLocaleString("en-IN")}
                      </div>

                      <p>
                        Area: {property.area} Sq. Ft.
                      </p>

                      <div className="match-reasons">

                        {property.matchReasons?.map(
                          (reason, index) => (
                            <span key={index}>
                              ✓ {reason}
                            </span>
                          )
                        )}

                      </div>

                      <button
                        onClick={() =>
                          openWhatsApp(property)
                        }
                      >
                        Enquire on WhatsApp
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default FindProperty;