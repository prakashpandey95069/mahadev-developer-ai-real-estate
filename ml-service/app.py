from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)

CORS(app)

# Current file ka folder
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# Model path
MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "property_price_model.pkl"
)

# Model load
model = joblib.load(MODEL_PATH)

print("ML model loaded successfully!")


# Test route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Mahadev Developer ML API is running"
    })


# Prediction route
@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # Required fields check
        required_fields = [
            "location",
            "property_type",
            "area_sqft",
            "road_width_ft",
            "distance_from_city_center_km",
            "property_age_years"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400


        # Input data
        input_data = pd.DataFrame([
            {
                "location": data["location"],

                "property_type":
                    data["property_type"],

                "area_sqft":
                    float(data["area_sqft"]),

                "road_width_ft":
                    float(data["road_width_ft"]),

                "distance_from_city_center_km":
                    float(
                        data[
                            "distance_from_city_center_km"
                        ]
                    ),

                "property_age_years":
                    float(
                        data["property_age_years"]
                    )
            }
        ])


        # Price prediction
        prediction = model.predict(
            input_data
        )[0]


        return jsonify({

            "success": True,

            "predicted_price":
                round(float(prediction), 2),

            "predicted_price_lakh":
                round(
                    float(prediction) / 100000,
                    2
                )

        })


    except Exception as error:

        print(
            "Prediction Error:",
            str(error)
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to predict property price",

            "error":
                str(error)

        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )