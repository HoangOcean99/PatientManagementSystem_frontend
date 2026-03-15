import axiosClient from "./axiosClient";

export const getDoctorSchedule = async (doctorId, date) => {
    // API mock hoặc thực tế
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

export const getListAppointments = async (params) => {
    return axiosClient.get('/appointment/getList', { params });
};

export const createAppointment = async (data) => {
    return axiosClient.post('/appointment/create', data);
};

export const getListSchedulesByDoctorIdAndDate = async (doctor_id, start_date, end_date) => { 
    return axiosClient.post('/doctor-slots/getAvailableDoctorSlotsByDoctorIdAndDate', { doctor_id, start_date, end_date });
};  

