import axiosClient from "./axiosClient";

export const getAllDepartments = async () => await axiosClient.get('/departments/getAllDepartments');
export const getDepartmentById = async (id) => await axiosClient.get(`/departments/getDepartmentById/${id}`);
export const createDepartment = async (data) => await axiosClient.post('/departments/createDepartment', data);
export const updateDepartment = async (id, data) => await axiosClient.put(`/departments/updateDepartment/${id}`, data);
export const deleteDepartment = async (id) => await axiosClient.delete(`/departments/deleteDepartment/${id}`);
export const getById = async (id) => await axiosClient.get(`/departments/getById/${id}`);

