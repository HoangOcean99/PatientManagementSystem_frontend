import axios from "axios";
import axiosClient from "./axiosClient";

// Dùng axios thuần (không qua axiosClient) để tránh interceptor supabase
const baseApi = {
    healthCheck: async () =>
        await axiosClient.get(`/base/test`, { timeout: 10000 }),
};

export default baseApi;
