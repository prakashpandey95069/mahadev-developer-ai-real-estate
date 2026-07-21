import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import SellProperty from "./pages/SellProperty";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AIChatbot from "./components/AIChatbot";
import PricePredictor from "./pages/PricePredictor";
import FindProperty from "./pages/FindProperty";
import PropertyMap from "./pages/PropertyMap";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Sirf Home Page par AI tools show honge
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar />

      {/* Sirf Home Page */}
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

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
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