import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      // Backend response se token nikalna
      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but token was not received."
        );
      }

      // ProtectedRoute aur api.js isi key ko use kar rahe hain
      localStorage.setItem("adminToken", token);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Admin Login Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <h1>MAHADEV</h1>
          <span>DEVELOPER</span>
        </div>

        <div className="admin-login-heading">
          <p>ADMIN PORTAL</p>
          <h2>Welcome Back</h2>
          <span>
            Sign in to manage your properties and customer
            enquiries.
          </span>
        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login to Dashboard"}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized access only
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;