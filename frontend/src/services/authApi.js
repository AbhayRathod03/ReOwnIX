import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    console.log("========== API REQUEST ==========");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Token:", token);
    console.log("Payload:", config.data);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Log every response
api.interceptors.response.use(
  (response) => {
    console.log("========== API RESPONSE ==========");
    console.log("Status:", response.status);
    console.log("URL:", response.config.url);
    console.log("Response:", response.data);

    return response;
  },
  (error) => {
    console.log("========== API ERROR ==========");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("URL:", error.config?.url);
      console.log("Response:", error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.dispatchEvent(new CustomEvent('auth-unauthorized'));
      }
    } else {
      console.log(error.message);
    }

    return Promise.reject(error);
  }
);

export default {
  get: api.get.bind(api),
  post: api.post.bind(api),
  put: api.put.bind(api),
  delete: api.delete.bind(api),

  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};