import axiosClient from './axiosClient';

/**
 * Fetches administration dashboard statistics from backend
 * @returns {Promise<Object>}
 */
export const getAdminDashboardStats = async () => {
    return await axiosClient.get('/dashboard/admin');
};
