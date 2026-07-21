import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/properties/${id}`
        );

        setProperty(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return <p className="status-message">Loading property...</p>;
  }

  return (
    <div className="property-details">

      <img
        src={
          property.image ||
          "https://placehold.co/900x500?text=Property"
        }
        alt={property.title}
      />

      <div className="details-content">

        <span>{property.propertyType}</span>

        <h1>{property.title}</h1>

        <h2>
          ₹{Number(property.price).toLocaleString("en-IN")}
        </h2>

        <p>📍 {property.location}</p>

        <p>📐 Area: {property.area}</p>

        <p>{property.description}</p>

        <div className="details-buttons">

          <a href="tel:9935926414" className="primary-btn">
            Call Now
          </a>

          <a
            href={`https://wa.me/919935926414?text=${encodeURIComponent(
              `Hello Mahadev Developer, I am interested in ${property.title}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}

export default PropertyDetails;