import axios from "axios";
import { supabase } from "../../supabaseClient";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
  },
  timeout: 10000
});


axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Logout error:", err);
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;