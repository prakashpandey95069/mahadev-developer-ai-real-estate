import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    propertyType: "",
    area: "",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      // api.js automatically JWT token attach karega
      const response = await api.post(
        "/properties",
        formData
      );

      console.log(
        "Property Added:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Property added successfully!"
      );

      // Reset form
      setFormData({
        title: "",
        location: "",
        price: "",
        propertyType: "",
        area: "",
        image: "",
        description: "",
      });

    } catch (error) {
      console.error(
        "Add Property Error:",
        error.response?.data ||
          error.message
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setMessage(
          "Your session has expired. Please login again."
        );

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Property add nahi ho payi."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-form">

        <p className="section-label">
          ADMIN PANEL
        </p>

        <h1>Add New Property</h1>

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Property Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Residential Plot in Gorakhpur"
            required
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Taramandal, Gorakhpur, Uttar Pradesh"
            required
          />

          <label>Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="1500000"
            min="0"
            required
          />

          <label>Property Type</label>

          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Property Type
            </option>

            <option value="Residential Plot">
              Residential Plot
            </option>

            <option value="Commercial Property">
              Commercial Property
            </option>

            <option value="Agricultural Land">
              Agricultural Land
            </option>

            <option value="House">
              House
            </option>
          </select>

          <label>Area</label>

          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="1200"
            required
          />

          <label>Image URL</label>

          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/property.jpg"
          />

          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write property details..."
            rows="5"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Adding Property..."
              : "Add Property"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Admin;