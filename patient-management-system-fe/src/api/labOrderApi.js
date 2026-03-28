import axiosClient from "./axiosClient";

export const labOrderApi = {

    getAllLabOrders: async (params = {}) => {
        return await axiosClient.get('/lab-orders', { params });
    },

    createLabOrders: async (data) => {
        return await axiosClient.post('/lab-orders', data);
    },

    getLabOrderById: async (labOrderId) => {
        return await axiosClient.get(`/lab-orders/${labOrderId}`);
    },

    getLabOrdersByRecordId: async (recordId) => {
        return await axiosClient.get(`/lab-orders/record/${recordId}`);
    },
    updateLabOrder: async (labOrderId, data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        return await axiosClient.patch(`/lab-orders/${labOrderId}`, data, config);
    },

    // Lab Services
    getLabServices: async (params = {}) => {
        return await axiosClient.get('/lab-services', { params });
    },
};

export default labOrderApi;
