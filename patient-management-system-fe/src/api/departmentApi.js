import axiosClient from "./axiosClient";

export const getAllDepartment = async () => await axiosClient.get('/department/getAllDepartments');
export const getDepartmentById = async (id) => await axiosClient.get(`/department/getDepartmentById/${id}`);
export const createDepartment = async (data) => await axiosClient.post('/department/createDepartment', data);
export const updateDepartment = async (id, data) => await axiosClient.put(`/department/updateDepartment/${id}`, data);
export const deleteDepartment = async (id) => await axiosClient.delete(`/department/deleteDepartment/${id}`);
