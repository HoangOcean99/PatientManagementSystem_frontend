import axiosClient from "./axiosClient";

export const labOrderApi = {
    // Lấy tất cả lab orders
    getAllLabOrders: async () => {
        return await axiosClient.get('/lab-orders');
    },

    // Tạo lab orders (BS khám gửi yêu cầu xét nghiệm)
    createLabOrders: async (data) => {
        return await axiosClient.post('/lab-orders', data);
    },

    // Lấy chi tiết 1 lab order theo ID
    getLabOrderById: async (labOrderId) => {
        return await axiosClient.get(`/lab-orders/${labOrderId}`);
    },

    // Cập nhật lab order (status, result_summary, result_file_url)
    updateLabOrder: async (labOrderId, data) => {
        return await axiosClient.patch(`/lab-orders/${labOrderId}`, data);
    },
};

export default labOrderApi;
