import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

// Har request ke saath admin token automatically attach hoga
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Expired/invalid admin session handle karo
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname.startsWith(
        "/admin"
      )
    ) {
      localStorage.removeItem(
        "adminToken"
      );

      // Login request fail hone par unnecessary redirect avoid karo
      if (
        window.location.pathname !==
        "/admin/login"
      ) {
        window.location.href =
          "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;