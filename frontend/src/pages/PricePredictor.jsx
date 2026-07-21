import { useState } from "react";
import axios from "axios";

function PricePredictor() {

  const [form, setForm] = useState({
    location: "",
    property_type: "",
    area_sqft: "",
    road_width_ft: "",
    distance_from_city_center_km: "",
    property_age_years: "0",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


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

      setResult(null);


      const response = await axios.post(

        "http://localhost:5001/predict",

        form

      );


      setResult(response.data);


    } catch (error) {

      console.error(
        "Prediction Error:",
        error
      );

      setError(
        "Price prediction failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="predictor-page">

      <div className="predictor-container">

        <p className="section-label">
          AI PROPERTY VALUATION
        </p>

        <h1>
          Property Price Predictor
        </h1>

        <p className="predictor-description">

          Enter your property details to get
          an AI-based estimated property price.

        </p>


        <form
          className="predictor-form"
          onSubmit={handleSubmit}
        >


          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Location
            </option>

            <option value="Taramandal">
              Taramandal
            </option>

            <option value="Medical College Road">
              Medical College Road
            </option>

            <option value="Rapti Nagar">
              Rapti Nagar
            </option>

            <option value="Rustampur">
              Rustampur
            </option>

            <option value="Khorabar">
              Khorabar
            </option>

            <option value="Kunraghat">
              Kunraghat
            </option>

            <option value="Sahjanwa">
              Sahjanwa
            </option>

            <option value="Gida">
              GIDA
            </option>

            <option value="Golghar">
              Golghar
            </option>

            <option value="Betiahata">
              Betiahata
            </option>

            <option value="Mohaddipur">
              Mohaddipur
            </option>

            <option value="Padri Bazar">
              Padri Bazar
            </option>

            <option value="Chargawan">
              Chargawan
            </option>

            <option value="Naushad">
              Naushad
            </option>

            <option value="Transport Nagar">
              Transport Nagar
            </option>

          </select>


          <select
            name="property_type"
            value={form.property_type}
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
            name="area_sqft"
            placeholder="Area in Sq. Ft."
            value={form.area_sqft}
            onChange={handleChange}
            min="1"
            required
          />


          <input
            type="number"
            name="road_width_ft"
            placeholder="Road Width in Feet"
            value={form.road_width_ft}
            onChange={handleChange}
            min="1"
            required
          />


          <input
            type="number"
            step="0.1"
            name="distance_from_city_center_km"
            placeholder="Distance from City Center (KM)"
            value={
              form.distance_from_city_center_km
            }
            onChange={handleChange}
            min="0"
            required
          />


          <input
            type="number"
            name="property_age_years"
            placeholder="Property Age"
            value={form.property_age_years}
            onChange={handleChange}
            min="0"
            required
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Predicting..."
              : "Predict Property Price"}

          </button>

        </form>


        {error && (

          <div className="prediction-error">

            {error}

          </div>

        )}


        {result && (
  <div className="prediction-result">
    <div className="result-badge">
      ML PRICE ESTIMATE
    </div>

    <p className="result-label">
      Estimated Property Value
    </p>

    <h2>
      ₹{Number(result.predicted_price).toLocaleString("en-IN")}
    </h2>

    <h3>
      ₹{result.predicted_price_lakh} Lakh
    </h3>

    <div className="price-range">
      <span>Estimated Market Range</span>

      <strong>
        ₹{(
          result.predicted_price_lakh * 0.9
        ).toFixed(2)}{" "}
        Lakh
        {" - "}
        ₹{(
          result.predicted_price_lakh * 1.1
        ).toFixed(2)}{" "}
        Lakh
      </strong>
    </div>

    <div className="result-details">
      <div>
        <span>Location</span>
        <strong>{form.location}</strong>
      </div>

      <div>
        <span>Property Type</span>
        <strong>{form.property_type}</strong>
      </div>

      <div>
        <span>Area</span>
        <strong>{form.area_sqft} Sq. Ft.</strong>
      </div>
    </div>

    <p className="prediction-note">
      This estimate is generated by a machine learning model
      trained on synthetic data and is not an official property
      valuation.
    </p>
  </div>
)}

      </div>

    </div>

  );

}

export default PricePredictor;