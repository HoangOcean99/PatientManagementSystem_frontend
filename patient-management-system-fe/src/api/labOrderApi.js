import axiosClient from "./axiosClient";

export const labOrderApi = {

    getAllLabOrders: async () => {
        return await axiosClient.get('/lab-orders');
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
        return await axiosClient.patch(`/lab-orders/${labOrderId}`, data);
    },
};

export default labOrderApi;
