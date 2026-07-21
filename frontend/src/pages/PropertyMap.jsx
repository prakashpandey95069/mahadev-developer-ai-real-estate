import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function PropertyMap() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gorakhpur default center
  const gorakhpurPosition = [
    26.7606,
    83.3732,
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/properties"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.properties || [];

        // Sirf coordinates wali properties
        const propertiesWithLocation =
          data.filter(
            (property) =>
              property.latitude !== null &&
              property.longitude !== null
          );

        setProperties(
          propertiesWithLocation
        );

      } catch (error) {
        console.log(
          "Map Properties Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="map-loading">
        Loading Property Map...
      </div>
    );
  }

  return (
    <div className="property-map-page">

      <div className="property-map-header">

        <p className="section-label">
          PROPERTY LOCATIONS
        </p>

        <h1>
          Explore Our Properties
        </h1>

        <p>
          View available Mahadev Developer
          properties across Gorakhpur on the map.
        </p>

      </div>

      <div className="property-map-container">

        <MapContainer
          center={gorakhpurPosition}
          zoom={12}
          scrollWheelZoom={true}
          className="property-map"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {properties.map(
            (property) => (

              <Marker
                key={property._id}
                position={[
                  property.latitude,
                  property.longitude,
                ]}
              >

                <Popup>

                  <div className="map-property-popup">

                    {property.image && (

                      <img
                        src={property.image}
                        alt={property.title}
                      />

                    )}

                    <h3>
                      {property.title}
                    </h3>

                    <p>
                      📍 {property.location}
                    </p>

                    <p>
                      🏠 {property.propertyType}
                    </p>

                    <p>
                      📐 {property.area}
                    </p>

                    <strong>
                      ₹
                      {Number(
                        property.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <a
                      href={`/properties/${property._id}`}
                    >
                      View Property
                    </a>

                  </div>

                </Popup>

              </Marker>

            )
          )}

        </MapContainer>

      </div>

      {properties.length === 0 && (

        <div className="no-map-properties">

          <h3>
            No mapped properties yet
          </h3>

          <p>
            Properties will appear here after
            their location coordinates are generated.
          </p>

        </div>

      )}

    </div>
  );
}

export default PropertyMap;