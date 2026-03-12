import axiosClient from "./axiosClient";

export const getDoctorSchedule = async (doctorId, date) => {
    return axiosClient.get(`/doctor/${doctorId}/schedule`, { params: { date } });
};

export const addScheduleSlot = async (doctorId, date, startTime, endTime) => {
    return axiosClient.post(`/doctor/${doctorId}/schedule`, { date, start_time: startTime, end_time: endTime });
};

export const deleteScheduleSlot = async (doctorId, slotId) => {
    return axiosClient.delete(`/doctor/${doctorId}/schedule/${slotId}`);
};

export const updateScheduleSlot = async (doctorId, slotId, data) => {
    return axiosClient.put(`/doctor/${doctorId}/schedule/${slotId}`, data);
};
