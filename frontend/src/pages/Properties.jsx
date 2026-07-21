import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/properties"
      );

      setProperties(response.data);
    } catch (error) {
      console.log("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="properties-page">
      <div className="page-header">
        <p>BUY • SELL • INVEST</p>
        <h1>Explore Our Properties</h1>
        <span>Find the right property for your future.</span>
      </div>

      {loading ? (
        <p className="status-message">Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="empty-properties">
          <h2>No Properties Available</h2>
          <p>New properties will be added soon.</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property._id}>

              <img
                src={
                  property.image ||
                  "https://placehold.co/600x400?text=Property"
                }
                alt={property.title}
              />

              <div className="property-info">
                <span className="property-type">
                  {property.propertyType}
                </span>

                <h2>{property.title}</h2>

                <p>📍 {property.location}</p>
                <p>📐 {property.area}</p>

                <h3>
                  ₹{Number(property.price).toLocaleString("en-IN")}
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