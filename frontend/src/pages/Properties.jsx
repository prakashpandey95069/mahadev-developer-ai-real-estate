import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      // Production: Vercel environment variable
      // Local: frontend/.env me VITE_API_URL use hoga
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/properties`
      );

      // Ensure response is an array
      if (Array.isArray(response.data)) {
        setProperties(response.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error(
        "Error fetching properties:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load properties. Please try again."
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="properties-page">
      {/* Page Header */}
      <div className="page-header">
        <p>BUY • SELL • INVEST</p>

        <h1>Explore Our Properties</h1>

        <span>
          Find the right property for your future.
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="status-message">
          Loading properties...
        </p>
      ) : error ? (
        /* Error */
        <div className="empty-properties">
          <h2>Unable to Load Properties</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchProperties}
          >
            Try Again
          </button>
        </div>
      ) : properties.length === 0 ? (
        /* No Properties */
        <div className="empty-properties">
          <h2>No Properties Available</h2>

          <p>
            New properties will be added soon.
          </p>
        </div>
      ) : (
        /* Properties Grid */
        <div className="property-grid">
          {properties.map((property) => (
            <div
              className="property-card"
              key={property._id}
            >
              {/* Property Image */}
              <img
                src={
                  property.image ||
                  "https://placehold.co/600x400?text=Property"
                }
                alt={
                  property.title ||
                  "Property"
                }
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400?text=Property";
                }}
              />

              {/* Property Information */}
              <div className="property-info">
                <span className="property-type">
                  {property.propertyType}
                </span>

                <h2>
                  {property.title}
                </h2>

                <p>
                  📍 {property.location}
                </p>

                <p>
                  📐 {property.area}
                </p>

                <h3>
                  ₹
                  {Number(
                    property.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h3>

                <Link
                  to={`/properties/${property._id}`}
                  className="view-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Properties;