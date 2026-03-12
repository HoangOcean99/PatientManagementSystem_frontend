import axiosClient from "./axiosClient";

export const getAllDoctors = async () => {
    const url = '/doctor/list';
    return axiosClient.get(url);
};

export const searchDoctors = async (name, specialization) => {
    const url = '/doctor/search';
    const params = {};
    if (name) params.name = name;
    if (specialization) params.specialization = specialization;

    return axiosClient.get(url, { params });
};

export const getDoctorById = async (id, params = {}) => {
    const url = `/doctor/detail/${id}`;
    return axiosClient.get(url, { params });
};


export const setupDoctor = async (id, data) => {
    const url = `/doctor/setup/${id}`;
    return axiosClient.post(url, data);
};

export const updateDoctor = async (id, data) => {
    const url = `/doctor/update/${id}`;
    return axiosClient.patch(url, data);
};

export const getAppointmentsByDoctorId = async (id) => {
    const url = `/doctor/appointments/${id}`;
    return axiosClient.get(url);
};
