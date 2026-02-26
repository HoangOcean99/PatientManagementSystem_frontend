import axiosClient from "./axiosClient";
export const getAllPatients = async () => await axiosClient.get('/patients');
export const searchPatients = async (keyword) => await axiosClient.get('/patient/search', { params: { keyword } });
