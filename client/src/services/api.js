import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Automatically attach token to every request
// So you never have to manually add it
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto logout when token expires (401)
// Interview point: "Response interceptor catches 401 globally
// so I don't handle token expiry in every component"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;