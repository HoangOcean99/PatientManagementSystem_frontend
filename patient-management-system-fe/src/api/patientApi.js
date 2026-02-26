import axiosClient from "./axiosClient";

export const getAllPatients = async () => await axiosClient.get('/patients');
export const searchPatients = async (keyword) => await axiosClient.get('/patient/search', { params: { keyword } });
export const getPatientById = async (id) => await axiosClient.get(`/patients/${id}`);
export const createPatient = async (data) => await axiosClient.post('/patients', data);
export const updatePatient = async (id, data) => await axiosClient.put(`/patients/${id}`, data);
