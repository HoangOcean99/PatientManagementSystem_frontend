import axiosClient from "./axiosClient";


export const listDoctorSlots = async (params = {}) => {
    return axiosClient.get('/doctor-slots/list', { params });
};

export const getDoctorSlotDetail = async (slotId) => {
    return axiosClient.get(`/doctor-slots/detail/${slotId}`);
};
export const createDoctorSlot = async (data) => {
    return axiosClient.post('/doctor-slots/create', data);
};
export const updateDoctorSlot = async (slotId, data) => {
    return axiosClient.put(`/doctor-slots/update/${slotId}`, data);
};
export const deleteDoctorSlot = async (slotId) => {
    return axiosClient.delete(`/doctor-slots/delete/${slotId}`);
};
