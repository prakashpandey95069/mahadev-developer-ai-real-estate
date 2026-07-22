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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Old error/result clear
    setError("");
  };

  // ==========================================
  // SUBMIT PREDICTION FORM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setResult(null);

      // Check ML API URL
      const mlApiUrl =
        import.meta.env.VITE_ML_API_URL;

      if (!mlApiUrl) {
        throw new Error(
          "VITE_ML_API_URL is not configured."
        );
      }

      // Backend ke expected format me data
      const predictionData = {
        location: form.location,

        property_type:
          form.property_type,

        area_sqft:
          Number(form.area_sqft),

        road_width_ft:
          Number(form.road_width_ft),

        distance_from_city_center_km:
          Number(
            form.distance_from_city_center_km
          ),

        property_age_years:
          Number(form.property_age_years),
      };

      console.log(
        "Prediction Request:",
        predictionData
      );

      // Production ML API request
      const response = await axios.post(
        `${mlApiUrl}/predict`,
        predictionData,
        {
          headers: {
            "Content-Type":
              "application/json",
          },

          timeout: 60000,
        }
      );

      console.log(
        "Prediction Response:",
        response.data
      );

      // Response validation
      if (
        !response.data ||
        response.data.success !== true
      ) {
        throw new Error(
          response.data?.message ||
            "Invalid prediction response."
        );
      }

      setResult(response.data);

    } catch (error) {
      console.error(
        "Prediction Error:",
        error.response?.data ||
          error.message
      );

      // Backend error
      if (error.response) {
        setError(
          error.response.data?.message ||
            "ML service returned an error."
        );
      }

      // Request timeout
      else if (
        error.code === "ECONNABORTED"
      ) {
        setError(
          "ML service is taking too long to respond. Please try again."
        );
      }

      // Environment variable missing
      else if (
        error.message ===
        "VITE_ML_API_URL is not configured."
      ) {
        setError(
          "ML service URL is not configured."
        );
      }

      // Network / other error
      else {
        setError(
          "Unable to connect to ML service. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictor-page">

      <div className="predictor-container">

        {/* Heading */}

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


        {/* Prediction Form */}

        <form
          className="predictor-form"
          onSubmit={handleSubmit}
        >

          {/* Location */}

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


          {/* Property Type */}

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


          {/* Area */}

          <input
            type="number"
            name="area_sqft"
            placeholder="Area in Sq. Ft."
            value={form.area_sqft}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />


          {/* Road Width */}

          <input
            type="number"
            name="road_width_ft"
            placeholder="Road Width in Feet"
            value={form.road_width_ft}
            onChange={handleChange}
            min="1"
            step="0.1"
            required
          />


          {/* Distance */}

          <input
            type="number"
            name="distance_from_city_center_km"
            placeholder="Distance from City Center (KM)"
            value={
              form.distance_from_city_center_km
            }
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />


          {/* Property Age */}

          <input
            type="number"
            name="property_age_years"
            placeholder="Property Age in Years"
            value={
              form.property_age_years
            }
            onChange={handleChange}
            min="0"
            step="1"
            required
          />


          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Predicting..."
              : "Predict Property Price"}
          </button>

        </form>


        {/* Error Message */}

        {error && (
          <div className="prediction-error">
            {error}
          </div>
        )}


        {/* Prediction Result */}

        {result && (
          <div className="prediction-result">

            <div className="result-badge">
              ML PRICE ESTIMATE
            </div>

            <p className="result-label">
              Estimated Property Value
            </p>

            <h2>
              ₹
              {Number(
                result.predicted_price
              ).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </h2>

            <h3>
              ₹
              {Number(
                result.predicted_price_lakh
              ).toFixed(2)}{" "}
              Lakh
            </h3>


            {/* Price Range */}

            <div className="price-range">

              <span>
                Estimated Market Range
              </span>

              <strong>
                ₹
                {(
                  Number(
                    result.predicted_price_lakh
                  ) * 0.9
                ).toFixed(2)}{" "}
                Lakh
                {" - "}
                ₹
                {(
                  Number(
                    result.predicted_price_lakh
                  ) * 1.1
                ).toFixed(2)}{" "}
                Lakh
              </strong>

            </div>


            {/* Property Details */}

            <div className="result-details">

              <div>
                <span>Location</span>

                <strong>
                  {form.location}
                </strong>
              </div>


              <div>
                <span>
                  Property Type
                </span>

                <strong>
                  {form.property_type}
                </strong>
              </div>


              <div>
                <span>Area</span>

                <strong>
                  {form.area_sqft} Sq. Ft.
                </strong>
              </div>

            </div>


            {/* Disclaimer */}

            <p className="prediction-note">
              This estimate is generated by
              a machine learning model trained
              on synthetic data and is not an
              official property valuation.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default PricePredictor;