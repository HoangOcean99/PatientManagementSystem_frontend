import axiosClient from "./axiosClient";

export const getAllClinicService = async () => await axiosClient.get('/clinic-service/getAllServices');
export const getAllClinicServiceByDepartment = async (department, is_active) => await axiosClient.get(`/clinic-service/getAllServicesByDepartment/${department}/${is_active}`);
export const getClinicServiceById = async (id) => await axiosClient.get(`/clinic-service/getServiceById/${id}`);
export const createClinicService = async (data) => await axiosClient.post('/clinic-service/createService', data);
export const updateClinicService = async (id, data) => await axiosClient.put(`/clinic-service/updateService/${id}`, data);
export const deleteClinicService = async (id) => await axiosClient.delete(`/clinic-service/deleteService/${id}`);
