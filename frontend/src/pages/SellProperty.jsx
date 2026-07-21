import { useState } from "react";
import axios from "axios";

function SellProperty() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    propertyType: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      setSuccessMessage("");

      // Step 1: MongoDB me enquiry save hogi
      await axios.post(
        "http://localhost:5000/api/enquiries",
        form
      );

      setSuccessMessage(
        "Enquiry submitted successfully!"
      );

      // Step 2: WhatsApp message create hoga
      const whatsappMessage = `
Hello Mahadev Developer,

I have submitted a property enquiry.

Name: ${form.name}
Phone: ${form.phone}
Property Type: ${form.propertyType}
Location: ${form.location}

Additional Details: ${form.message}

Please contact me regarding this property.
`;

      // Step 3: WhatsApp open hoga
      const whatsappURL =
        `https://wa.me/919935926414?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      window.open(whatsappURL, "_blank");

      // Step 4: Form clear hoga
      setForm({
        name: "",
        phone: "",
        location: "",
        propertyType: "",
        message: "",
      });

    } catch (error) {
      console.log("Enquiry Error:", error);

      setSuccessMessage(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="property-form">

        <p className="section-label">
          SELL YOUR PROPERTY
        </p>

        <h1>List Your Property</h1>

        <p>
          Submit your property details and our team will contact you.
        </p>

        {successMessage && (
          <div className="form-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
            placeholder="Property Location"
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

          <textarea
            name="message"
            placeholder="Tell us more about your property..."
            value={form.message}
            onChange={handleChange}
            rows="5"
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Submitting..."
              : "Submit Property Enquiry"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SellProperty;