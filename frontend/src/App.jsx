import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import SellProperty from "./pages/SellProperty";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";

import PricePredictor from "./pages/PricePredictor";
import FindProperty from "./pages/FindProperty";
import PropertyMap from "./pages/PropertyMap";

import AIChatbot from "./components/AIChatbot";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Admin pages check
  const isAdminPage =
    location.pathname.startsWith("/admin");

  // AI tools sirf Home page par
  const isHomePage =
    location.pathname === "/";

  return (
    <>
      {/* Admin dashboard par normal website navbar nahi dikhega */}
      {!isAdminPage && <Navbar />}

      {/* AI tools sirf Home page par */}
      {isHomePage && (
        <>
          <AIChatbot />

          <Link
            to="/price-predictor"
            className="price-predictor-floating-btn"
            title="AI Property Price Predictor"
          >
            <span className="predictor-icon">
              📊
            </span>

            <span className="predictor-text">
              AI Price Predictor
            </span>
          </Link>
        </>
      )}

      <Routes>

        {/* ===============================
            PUBLIC ROUTES
        =============================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/sell-property"
          element={<SellProperty />}
        />

        <Route
          path="/property-map"
          element={<PropertyMap />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/price-predictor"
          element={<PricePredictor />}
        />

        <Route
          path="/find-property"
          element={<FindProperty />}
        />


        {/* ===============================
            ADMIN LOGIN
        =============================== */}

        


        {/* ===============================
            ADMIN DASHBOARD
        =============================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


       

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />


       

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;