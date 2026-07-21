import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# ==============================
# 1. LOAD DATASET
# ==============================

data = pd.read_csv(
    "data/gorakhpur_property_ml_synthetic_dataset.csv"
)

print("Dataset loaded successfully")
print("Total rows:", len(data))


# ==============================
# 2. SELECT FEATURES
# ==============================

features = [
    "location",
    "property_type",
    "area_sqft",
    "road_width_ft",
    "distance_from_city_center_km",
    "property_age_years"
]

X = data[features]

y = data["price_inr"]


# ==============================
# 3. TRAIN TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# ==============================
# 4. PREPROCESSING
# ==============================

categorical_features = [
    "location",
    "property_type"
]

numeric_features = [
    "area_sqft",
    "road_width_ft",
    "distance_from_city_center_km",
    "property_age_years"
]


preprocessor = ColumnTransformer(
    transformers=[
        (
            "category",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "number",
            "passthrough",
            numeric_features
        )
    ]
)


# ==============================
# 5. RANDOM FOREST MODEL
# ==============================

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)


# ==============================
# 6. CREATE PIPELINE
# ==============================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)


# ==============================
# 7. TRAIN MODEL
# ==============================

print("\nTraining model...")

pipeline.fit(
    X_train,
    y_train
)

print("Model training completed")


# ==============================
# 8. TEST MODEL
# ==============================

predictions = pipeline.predict(
    X_test
)

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)


print("\nMODEL PERFORMANCE")

print(
    "Mean Absolute Error:",
    round(mae, 2)
)

print(
    "R2 Score:",
    round(r2, 4)
)


# ==============================
# 9. SAVE MODEL
# ==============================

os.makedirs(
    "model",
    exist_ok=True
)

joblib.dump(
    pipeline,
    "model/property_price_model.pkl"
)

print(
    "\nModel saved successfully!"
)

print(
    "Location: model/property_price_model.pkl"
)