import axiosClient from "./axiosClient";

export const getServices = async () => {
  const url = '/clinic-services/getList';
  return axiosClient.get(url);
};
export const getAllServices = async () => {
  const url = '/clinic-services/getList';
  return axiosClient.get(url);
}; 

export const getServicesbyDepartmentId = async (departmentId) => {
  const url = `/clinic-services/getByDepartmentId/${departmentId}`;
  return axiosClient.get(url);
};