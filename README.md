# 🏡 Mahadev Developer – AI-Powered Real Estate Platform

Mahadev Developer is a full-stack AI-powered real estate web application built for property buyers, sellers, and administrators in Gorakhpur, Uttar Pradesh.

The platform allows users to explore properties, submit buying requirements, list properties for sale, estimate property prices using Machine Learning, interact with an AI assistant, and explore property locations on an interactive map.

The system also includes an automated property matching and lead management workflow for administrators.

---

## ✨ Features

### 🏠 Property Management
- Browse available property listings
- View complete property details
- Residential, commercial, and agricultural property support
- Property image and description support
- Admin-controlled property management

### 🔍 Smart Property Finder
Users can submit their property requirements including:

- Preferred location
- Property type
- Budget
- Minimum area
- Maximum area

The system automatically compares the buyer's requirements with available properties.

### 🤖 Smart Property Matching Engine

The automated matching system:

1. Receives a new buyer requirement
2. Calculates property match scores
3. Finds the best matching properties
4. Assigns the best property to the buyer
5. Moves unmatched buyers to a watchlist
6. Automatically checks watchlisted buyers when a new property is added

This creates an automated buyer-to-property matching workflow.

### 📊 AI Lead Scoring

Buyer leads are automatically analyzed and classified as:

- 🔥 Hot Lead
- 🟡 Warm Lead
- ❄️ Cold Lead

The lead score helps administrators prioritize potential customers.

### 💰 ML Property Price Predictor

The platform includes a Machine Learning-based property valuation system.

Users can enter:

- Location
- Property type
- Area in square feet
- Road width
- Distance from city center

The trained ML model returns an estimated property value.

> The generated property price is an ML-based estimate and should not be considered an official property valuation.

### 🧠 AI Property Assistant

The integrated AI assistant helps users with property-related queries and provides guidance directly from the website.

### 🗺️ Interactive Property Map

Properties can be displayed on an interactive map using:

- React Leaflet
- OpenStreetMap

Property locations are automatically converted into latitude and longitude coordinates through geocoding.

Users can click property markers to view property information.

### 🔔 Automated Notifications

The backend automatically generates notifications for events such as:

- New buyer registration
- Successful property match
- New matching opportunities

### 📋 Admin Dashboard

The protected admin dashboard allows administrators to:

- View total properties
- Manage customer enquiries
- View new leads
- Track closed deals
- Update enquiry status
- Delete enquiries
- Contact customers via phone
- Contact customers via WhatsApp
- Add new properties

### 🔐 Admin Authentication

Admin routes are protected using:

- JWT authentication
- Protected frontend routes
- Protected backend APIs
- Password hashing using bcrypt

Unauthorized users cannot access protected admin functionality.

### 📱 Responsive Design

The website is optimized for:

- Desktop
- Tablet
- Mobile devices

---

## 🔄 Automated Workflow

```text
New Buyer
    ↓
Save Requirement
    ↓
Lead Scoring
    ↓
Smart Matching Engine
    ↓
Best Match Found?
   ↙            ↘
 YES             NO
 ↓               ↓
Create Match    Watchlist
 ↓               ↓
Admin Alert     New Property Added
 ↓               ↓
Follow-up       Automatic Re-Matching
                 ↓
              Match Alert