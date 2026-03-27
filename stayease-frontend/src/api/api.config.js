import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response.data.data
      ? { ...response, data: response.data.data }
      : response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ERROR 1: Agar refresh token wali API khud fail ho jaye (401), toh loop break karo
    if (originalRequest.url.includes("/auth/refresh")) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // ERROR 2: Agar normal API 401 de aur humne abhi tak retry nahi kiya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API.defaults.baseURL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
        );

        localStorage.setItem("token", data.access_token);
        API.defaults.headers.common["Authorization"] =
          `Bearer ${data.access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Agar yahan fail hua, toh matlb refresh token bekar hai
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
