import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
      setError("");

      // Production me Vercel environment variable use hoga
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form
      );

      // JWT token save
      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      // Admin information bhi save karo
      if (response.data.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.admin)
        );
      }

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "Admin Login Error:",
        error.response?.data || error.message
      );

      if (!error.response) {
        setError(
          "Server se connect nahi ho pa raha. Please try again."
        );
      } else if (error.response.status === 401) {
        setError(
          "Invalid email or password."
        );
      } else if (error.response.status === 429) {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else if (error.response.status === 403) {
        setError(
          "Access denied."
        );
      } else {
        setError(
          error.response?.data?.message ||
          "Login failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="login-logo">
          <h2>MAHADEV</h2>
          <span>DEVELOPER</span>
        </div>

        <h1>Admin Login</h1>

        <p>
          Login to manage properties and customer enquiries.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter admin email"
            autoComplete="email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;